import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { Aviso } from '../../../models/aviso.model';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmationDialog } from 'app/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'correos',
  templateUrl: './correos.component.html',
  styleUrls: ['./correos.component.scss']
})

export class CorreosComponent implements OnInit {

  talleres;

  publico: string;
  idtaller = 0;

  constructor(private api: ApiService, public dialog: MatDialog, public snackBar: MatSnackBar) {
    this.talleres = [];
    this.publico = '';
  }

  ngOnInit() {

    this.obtenerTalleres();
  }


  obtenerTalleres() {
    this.api.getAllTalleres().subscribe(result => {
      this.talleres = result[0];
    });
  }

  publicar() {
    if (this.checkInputs()) {
      const dialogRef = this.dialog.open(ConfirmationDialog, {
        disableClose: true
      });
      dialogRef.componentInstance.mensajeConfirmacion = `Se le redirigirá a su cliente de correo predeterminado para enviar el correo. ¿Desea continuar?`;

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (this.publico === 'general') {
            this.idtaller = 0;
          }
          this.api.getCorreosByTallerId(this.idtaller).subscribe(res => {
            const correos = res.join(',');
            window.location.href = `mailto:?bcc=${correos}`;
          }, error => {
            this.snackBar.open(error.error, '', {
              duration: 1800
            });
          });
        }
      });

    } else {
      this.snackBar.open('Revise que todos los campos sean correctos.', '', {
        duration: 1600
      });
    }
  }

  resetInputs() {
    this.publico = 'general';
  }

  checkInputs(): boolean {
    if (this.publico === '') {
      return false;
    }

    if (this.publico === 'especifico') {
      return (this.idtaller > 0);
    }

    return true;
  }
}

