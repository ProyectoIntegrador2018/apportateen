import { Component, OnInit, Inject, } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { Aviso } from 'app/models/aviso.model';
import { ApiService } from 'app/services/api/api.service';
import { User } from 'app/models/user.model';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { NgxPermissionsService } from 'ngx-permissions';

export interface DialogData{

}

@Component({
  selector: 'app-aviso-inscripcion-taller',
  templateUrl: './aviso-inscripcion-taller.component.html',
  styleUrls: ['./aviso-inscripcion-taller.component.scss']
})
export class AvisoInscripcionTallerComponent implements OnInit {
  user = new User();
  num_conf_pago : string = null;

  constructor(public dialogRef: MatDialogRef<AvisoInscripcionTallerComponent>, @Inject(MAT_DIALOG_DATA) public result : DialogData,
  private api: ApiService,
  public snackbar: MatSnackBar,
  private router : Router,
  private afAuth: AngularFireAuth,
  @Inject(LOCAL_STORAGE) private storage: WebStorageService,
  private permissionsService: NgxPermissionsService) { 
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.getUser(this.result['id']);
  }

  getUser(id) {
    this.api.getUserById(id).subscribe(result=> {
      this.user = result;
      this.num_conf_pago = result.num_conf_pago;
    })
  }

  guardarNumPago() {
    if(this.num_conf_pago != null) {
      this.user.num_conf_pago = this.num_conf_pago;
      this.api.updateUsuarioNumConfPago(this.user).subscribe(result => {
        if(result.status == 'success') {
          this.snackbar.open(result.message, '', {
            duration: 5000,
          });

          if(this.user.idtaller > 0) {
            this.dialogRef.close();
          }
        }
      }, error => {
        this.snackbar.open(error.error, '', {
          duration: 5000,
        });
      });
    } else {
      this.snackbar.open("Ingrese el Número de Confirmación de Pago porfavor.", '', {
        duration: 5000,
      });
    }
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
        this.dialogRef.close();
        this.storage.remove('@user:data');
        this.permissionsService.flushPermissions();
        this.router.navigate(['ingresar']);
    })
}

}
