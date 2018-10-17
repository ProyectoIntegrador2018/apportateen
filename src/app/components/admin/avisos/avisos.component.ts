import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { Aviso } from '../../../models/aviso.model';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';

@Component({
  selector: 'avisos',
  templateUrl: './avisos.component.html',
  styleUrls: ['./avisos.component.scss']
})

export class AvisosComponent implements OnInit {
  newAviso: Aviso;
  talleres;
  selectedAviso: Aviso = new Aviso();
  avisos;
  mensaje: string;
  titulo: string;
  editMode: boolean;
  publico: string;
  idtaller = 0;

  constructor(private api: ApiService, public dialog: MatDialog, public snackBar: MatSnackBar) {
    this.avisos = [];
    this.talleres = [];
    this.mensaje = '';
    this.titulo = '';
    this.editMode = false;
    this.publico = '';
  }

  ngOnInit() {
    this.obtenerAvisos();
    this.obtenerTalleres();
  }

  obtenerAvisos() {
    this.api.getAllAvisos().subscribe(result => {
      this.avisos = result;
    });
  }

  obtenerTalleres() {
    this.api.getAllTalleres().subscribe(result => {
      this.talleres = result;
    })
  }

  eliminar(aviso: Aviso) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: true
    });
    dialogRef.componentInstance.mensajeConfirmacion = `Se eliminará el aviso ${aviso.titulo}. ¿Desea continuar?`;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.removeAviso(aviso.id).subscribe(res => {
          if (res.status == 'success') {
            this.obtenerAvisos();
            this.selectedAviso = new Aviso();
          }
          this.snackBar.open(res.message, '', {
            duration: 900,
          });
        });
      }
    });
  }

  editar(aviso: Aviso) {
    this.selectedAviso = Object.assign({}, aviso);
    this.publico = aviso.taller == 'Aviso público general' ? 'general' : 'especifico';
    this.editMode = true;
  }

  publicar() {
    if (this.checkInputs()) {
      if (this.editMode) {
        const dialogRef = this.dialog.open(ConfirmationDialog, {
          disableClose: true
        });
        dialogRef.componentInstance.mensajeConfirmacion = `Se modificará el aviso ${this.selectedAviso.titulo}. ¿Desea continuar?`;
        if (this.publico == 'general') {
          this.selectedAviso.idtaller = 0;
        }
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.api.updateAviso(this.selectedAviso).subscribe(res => {
              this.snackBar.open(res.message, '', {
                duration: 900
              });
              this.resetInputs();
            });
          }
        });
      } else {
        this.api.createAviso(this.selectedAviso).subscribe(result => {
          this.snackBar.open(result.message, '', {
            duration: 900
          });
          this.resetInputs();
        });
      }
    } else {
      this.snackBar.open('Revise que todos los campos sean correctos.', '', {
        duration: 1600
      })
    }
  }

  resetInputs() {
    this.selectedAviso = new Aviso();
    this.publico = 'general';
    this.editMode = false;
    this.obtenerAvisos();
  }

  checkInputs(): boolean {
    let a = this.selectedAviso;
    if (this.publico == '') {
      return false;
    }
    if (this.publico != 'general') {
      if (this.selectedAviso.idtaller < 1) {
        return false;
      }
    }
    if (!a.mensaje || !a.titulo) {
      return false;
    }
    return true;
  }
}

@Component({
  selector: 'confirm-dialog',
  template: `<h1 mat-dialog-title>Confirmación</h1>
  <div mat-dialog-content>
    <p>{{mensajeConfirmacion}}</p>
  </div>
  <div mat-dialog-actions>
    <button mat-button (click)="dialogRef.close(false)" color="primary">No, cancelar</button>
    <button mat-button (click)="dialogRef.close(true)" color="warn" cdkFocusInitial>Sí, continuar</button>
  </div>`
})
export class ConfirmationDialog {
  public mensajeConfirmacion: string;
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialog>) { }
}
