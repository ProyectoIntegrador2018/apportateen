import { Component, Inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ApiService } from '../../../services/api/api.service';
import { User } from '../../../models/user.model';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';


export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

@Component({
    selector: 'signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})

export class SignupComponent {
    password: string;
    passwordConf: string;
    fecha_nacimiento: string;
    usuario: User = new User();
    hide = true;
    hideConf = true;
    emailFormControl = new FormControl('', [
        Validators.required,
        Validators.email,
    ]);
    loading: boolean;
    dateReg = /^\d{2}([./-])\d{2}\1\d{4}$/;
    matcher = new MyErrorStateMatcher();


    constructor(private firebaseAuth: AngularFireAuth,
        private api: ApiService,
        private permissionsService: NgxPermissionsService,
        @Inject(LOCAL_STORAGE) private storage: WebStorageService,
        public router: Router,
        public snackBar: MatSnackBar) {
        this.loading = false;
        this.password = "";
        this.passwordConf = "";
    }

    validate(): boolean {
        if (this.usuario.correo.trim().length == 0 || this.usuario.nombre.trim().length == 0 ||
            this.usuario.apellido.trim().length == 0 || this.password.trim().length == 0 ||
            this.passwordConf.trim().length == 0 || !this.usuario.fecha_nacimiento.match(this.dateReg) ||
            this.usuario.fecha_nacimiento == "31-12-1969" || this.password != this.passwordConf ) {
            return false;
        }
        return true;
    }

    signup() {
        this.usuario.fecha_nacimiento = this.formatDate(this.fecha_nacimiento);
        if (this.validate()) {
            if (this.password.length >= 6) {
                this.loading = true;
            this.firebaseAuth.auth.createUserWithEmailAndPassword(this.usuario.correo, this.password).
                then(user => {
                    this.usuario.id = user.user.uid;
                    this.api.createUser(this.usuario).subscribe(result => {
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
                    console.log(error.message);
                })
            }else{
                this.snackBar.open('La contraseña debe ser mayor a 5 caracteres', '', {
                    duration: 2000,
                });
            }
            
        }
        else {
            this.snackBar.open('Revise que todos los campos estén correctos.', '', {
                duration: 2000,
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