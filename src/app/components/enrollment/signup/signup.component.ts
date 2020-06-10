import { Component, OnInit, Inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ApiService } from '../../../services/api/api.service';
import { User } from '../../../models/user.model';
import { FormControl, FormGroupDirective, NgForm, Validators, FormBuilder, FormGroup, } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { Tutor } from 'app/models/tutor.model';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export interface Select {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {
  password: string;
  passwordConf: string;
  fecha_nacimiento: string;
  usuario: User = new User();
  tutor: Tutor = new Tutor();
  hide = true;
  hideConf = true;
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  loading: boolean;
  dateReg = /^\d{2}([./-])\d{2}\1\d{4}$/;
  emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  matcher = new MyErrorStateMatcher();
  sexs: Select[] = [
    { value: 'Masculino', viewValue: 'Masculino' },
    { value: 'Femenino', viewValue: 'Femenino' }
  ];

  sTypes: Select[] = [
    { value: 'Pública', viewValue: 'Pública' },
    { value: 'Privada', viewValue: 'Privada' }
  ];

  siNo: Select[] = [
    { value: 'Si', viewValue: 'Si' },
    { value: 'No', viewValue: 'No' }
  ];

  grades: Select[] = [
    { value: '1ro secundaria', viewValue: '1er año de secundaria' },
    { value: '2do secundaria', viewValue: '2do año de secundaria' },
    { value: '3ro secundaria', viewValue: '3er año de secundaria' },
    { value: '1ro prepa', viewValue: '1er año de prepa' },
    { value: '2do prepa', viewValue: '2do año de prepa' },
    { value: '3ro prepa', viewValue: '3er año de prepa' }
  ];

  isLinear = true;
  firstFormGroup: FormGroup;

  constructor(private firebaseAuth: AngularFireAuth,
    private api: ApiService,
    private permissionsService: NgxPermissionsService,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    public router: Router,
    public snackBar: MatSnackBar,
    private _formBuilder: FormBuilder) {
    this.loading = false;
    this.password = "";
    this.passwordConf = "";
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      nameCtrl: ['', Validators.required],
      lastNameCtrl: ['', Validators.required],
      dateCtrl: ['', Validators.required],
      curpCtrl: ['', Validators.required],
      telCtrl: ['', Validators.required],
      sexCtrl: ['', Validators.required],
      nameTutCtrl: ['', Validators.required],
      telTutCtrl: ['', Validators.required],
      emailTutCtrl: ['', Validators.required],
      nameSchoolCtrl: ['', Validators.required],
      typeSchoolCtrl: ['', Validators.required],
      gradeCtrl: ['', Validators.required]
    });
  }




  validate(): boolean {
    if (this.usuario.correo.trim().length == 0 || this.usuario.nombre.trim().length == 0 ||
      this.usuario.apellido.trim().length == 0 || this.password.trim().length == 0 ||
      this.passwordConf.trim().length == 0 || !this.usuario.fecha_nacimiento.match(this.dateReg) ||
      this.usuario.fecha_nacimiento == "31-12-1969" || this.password != this.passwordConf) {
      return false;
    }
    return true;
  }

  // función para verificar el mail del tutor antes de pasar a "siguiente" y no al final cuando registras
  mailTutor(stepper) {
    if (!(this.usuario.tutor_correo.match(this.emailReg))) {
      this.snackBar.open('La dirección de correo del tutor no es valida', '', {
        duration: 2000,
      });

    } else {
      stepper.next();
    }


  }



  signup() {
    console.log(this.usuario);
    this.usuario.fecha_nacimiento = this.formatDate(this.fecha_nacimiento);
    if (this.validate()) {

      if (this.password.length >= 6) {
        this.loading = true;
        this.firebaseAuth.auth.createUserWithEmailAndPassword(this.usuario.correo, this.password).
          then(user => {
            this.usuario.id = user.user.uid;
            this.api.createUserTaller(this.usuario).subscribe(result => {
              this.api.getUserById(this.usuario.id).subscribe(userResult => {
                const perm = ["USER"];
                this.storage.set('@user:data', userResult);
                this.permissionsService.loadPermissions(perm);
                this.router.navigate(['usuario']);
                this.loading = false;
              })
            }, error => {
              this.firebaseAuth.auth.signOut();
              this.snackBar.open(error.error, '', {
                duration: 2400,
              });
              this.loading = false;
            });
          })
          .catch(error => {
            this.loading = false;
            if (error["code"] = "auth/email-already-in-use") {
              this.snackBar.open("El correo electrónico proporcionado ya tiene una cuenta.", '', {
                duration: 2600,
              });
            } else{
              this.snackBar.open("Error, favor de volver a intentar.", '', {
                duration: 2600,
              });
            }
          })
      } else {
        this.snackBar.open('La contraseña debe ser mayor a 5 caracteres.', '', {
          duration: 2500,
        });
      }


    }
    else {
      this.snackBar.open('Revise que todos los campos estén correctos.', '', {
        duration: 2500,
      });
    }
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [day, month, year].join('-');
  }


}
