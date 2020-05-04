import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { Aviso } from '../../../models/aviso.model';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmationDialog } from 'app/components/confirmation-dialog/confirmation-dialog.component';
import { AvisosDialog } from 'app/components/avisos-dialog/avisos-dialog.component';
import { Sede } from 'app/models/sede.model';

@Component({
  selector: 'avisos',
  templateUrl: './avisos.component.html',
  styleUrls: ['./avisos.component.scss']
})

export class AvisosComponent implements OnInit {
  sedes: Sede[];

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
    this.obtenersedes();
  }

  obtenerAvisos() {
    this.api.getAllAvisos().subscribe(result => {
      this.avisos = result;
    });
  }

  obtenerTalleres() {
    this.api.getAllTalleres().subscribe(result => {
      this.talleres = result[0];
    })
  }
  
  obtenersedes() {
    this.api.getAllSedes().subscribe(result => {
      this.sedes = result;
    });
  }

  eliminar(aviso: Aviso) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: true
    });
    dialogRef.componentInstance.mensajeConfirmacion = `Se eliminará el aviso seleccionado. ¿Desea continuar?`;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.removeAviso(aviso.id).subscribe(res => {
          if (res.status == 'success') {
            this.resetInputs();
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

  // publicar() {
  //   if (this.checkInputs()) {
  //     if (this.editMode) {
  //       const dialogRef = this.dialog.open(ConfirmationDialog, {
  //         disableClose: true
  //       });
  //       dialogRef.componentInstance.mensajeConfirmacion = `Se modificará el aviso seleccionado. ¿Desea continuar?`;
  //       if (this.publico == 'general') {
  //         this.selectedAviso.idtaller = 0;
  //       }
  //       dialogRef.afterClosed().subscribe(result => {
  //         if (result) {
  //           this.api.updateAviso(this.selectedAviso).subscribe(res => {
  //             this.snackBar.open(res.message, '', {
  //               duration: 900
  //             });
  //             this.resetInputs();
  //           });
  //         }
  //       });
  //     } else {
  //       this.api.createAviso(this.selectedAviso).subscribe(result => {
  //         this.snackBar.open(result.message, '', {
  //           duration: 900
  //         });
  //         this.resetInputs();
  //       });
  //     }
  //   } else {
  //     this.snackBar.open('Revise que todos los campos sean correctos.', '', {
  //       duration: 1600
  //     })
  //   }
  // }

  resetInputs() {
    this.selectedAviso = new Aviso();
    this.publico = 'general';
    this.editMode = false;
    this.obtenerAvisos();
  }

  // checkInputs(): boolean {
  //   let a = this.selectedAviso;
  //   if (this.publico == '') {
  //     return false;
  //   }
  //   if (this.publico != 'general') {
  //     if (this.selectedAviso.idtaller < 1) {
  //       return false;
  //     }
  //   }
  //   if (!a.mensaje || !a.titulo) {
  //     return false;
  //   }
  //   return true;
  // }

  enviarAviso(option: number) {
    if (option === 1) {
      const dialogRef = this.dialog.open(AvisosDialog, {
        data: { target: 'General' },
        width: "80%"
      })
    }
    else if( option === 2){
      const dialogRef = this.dialog.open(AvisosDialog, {
        data: { posiblesDestinararios: this.talleres, target: 'por Taller' },
        width: "80%"
      })
      console.log(this.talleres)
    }
    else if( option === 3){
      const dialogRef = this.dialog.open(AvisosDialog, {
        data: { posiblesDestinararios: this.sedes, target: 'por Sede' },
        width: "80%"
      })
    }
    else if( option === 4){
      const dialogRef = this.dialog.open(AvisosDialog, {
        data: { posiblesDestinararios: this.sedes, target: 'a Responsables' },
        width: "80%"
      })
    }

  }
}

