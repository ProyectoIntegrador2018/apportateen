import { Component, OnInit, Inject, } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { Aviso } from 'app/models/aviso.model';
import { ApiService } from 'app/services/api/api.service';
import { User } from 'app/models/user.model';
import { Router } from '@angular/router';

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
  private router : Router) { 
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
    this.user.num_conf_pago = this.num_conf_pago;
    this.api.updateUsuarioNumConfPago(this.user).subscribe(result => {
      if(result.status == 'success') {
        this.snackbar.open(result.message, '', {
          duration: 2000,
        });

        if(this.user.idtaller > 0) {
          this.dialogRef.close();
        }
      }
    }, error => {
      this.snackbar.open(error.error, '', {
        duration: 2000,
      });
    });
  }

}
