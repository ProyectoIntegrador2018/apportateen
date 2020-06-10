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
  sedesById = [{}];

  newAviso: Aviso;
  talleres;
  selectedAviso: Aviso = new Aviso();
  avisos;
  mensaje: string;
  titulo: string;
  publico: string;
  idtaller = 0;

  loading = true;

  constructor(private api: ApiService, public dialog: MatDialog, public snackBar: MatSnackBar) {
    this.avisos = [];
    this.talleres = [];
    this.mensaje = '';
    this.titulo = '';
    this.publico = '';
  }

  ngOnInit() {
    this.loading = true;
    this.obtenerAvisos(() => {
      this.obtenerTalleres(() => {
        this.obtenersedes(() => {
          this.loading = false;
        });
      });
    });


  }

  obtenerAvisos(callback) {
    this.api.getAllAvisos().subscribe(result => {
      this.avisos = result;
      callback();
    });
  }

  obtenerTalleres(callback) {
    this.api.getAllTalleres().subscribe(result => {
      this.talleres = result[0];
      callback();
    })
  }

  obtenersedes(callback) {
    this.api.getAllSedes().subscribe(result => {
      this.sedes = result;
      this.procesarSedes()
      callback();
    });
  }

  procesarSedes() {
    /*
    In order to get the get the Sedes name easier for the modal chips, 
    a dictionary is created with the Sede ID as key.
    */
    this.sedes.forEach(sede => {
      let id = sede.id;
      let nombre = sede.nombre;
      this.sedesById.push({ id: nombre })
    })
  }

  eliminar(aviso: Aviso) {
    // Open a confirmation dialog to delete the selected Aviso
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: true
    });
    dialogRef.componentInstance.mensajeConfirmacion = `Se eliminará el aviso seleccionado. ¿Desea continuar?`;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.removeAviso(aviso.id).subscribe(res => {
          if (res.status == 'success') {
            this.selectedAviso = new Aviso
          }
          this.snackBar.open(res.message, '', {
            duration: 900,
          });
          this.loading = true;
          this.obtenerAvisos(()=>{
            this.loading = false;
          })
        });
      }
    });
  }

  editar(aviso: Aviso) {
    // Opens a dialog to edit the announcement.
    this.selectedAviso = Object.assign({}, aviso);
    var dialogRef;

    // Depending on the type of message is the data that is going to be givven to the dialog
    if (this.selectedAviso.general == true) {
      dialogRef = this.dialog.open(AvisosDialog, {
        data: { target: 1, edit: true,aviso: this.selectedAviso, posiblesDestinararios: null }
      });
    } else if (this.selectedAviso.sede == null) {
      dialogRef = this.dialog.open(AvisosDialog, {
        data: { destinatariosactuales: this.selectedAviso.nombretalleres, posiblesDestinararios: this.talleres, target: 2, edit: true, aviso: this.selectedAviso }
      });
    } else if (this.selectedAviso.taller == null) {
      dialogRef = this.dialog.open(AvisosDialog, {
        data: { destinatariosactuales: this.selectedAviso.nombresedes, posiblesDestinararios: this.sedes, target: 3, edit: true, aviso: this.selectedAviso }
      });
    }

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loading = true;
        this.obtenerAvisos(()=>{
          this.loading = false;
        });
      }
    })
  }

  select(aviso) {
    this.selectedAviso = aviso
  }

  enviarAviso(option: number) {
    /* 
    Dependieng on the target is the type of announcement to crate:
    1 -> General
    2 -> Taller
    3 -> Sede
    4 -> Responsables (By the email client)
    */
    var dialogRef;
    if (option === 1) {
      dialogRef = this.dialog.open(AvisosDialog, {
        data: { target: option },
        width: "80%"
      })
    }
    else if (option === 2) {
      dialogRef = this.dialog.open(AvisosDialog, {
        data: { posiblesDestinararios: this.talleres, target: option },
        width: "80%"
      })
    }
    else if (option === 3) {
      dialogRef = this.dialog.open(AvisosDialog, {
        data: { posiblesDestinararios: this.sedes, target: option },
        width: "80%"
      })
    }
    else if (option === 4) {
      dialogRef = this.dialog.open(AvisosDialog, {
        data: { posiblesDestinararios: this.sedes, target: option },
        width: "80%"
      })
    }

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // If the announcement was created successfully the dialog returns True.

        this.snackBar.open('Aviso enviado', '', {
          duration: 2000,
        });

        this.loading = true;
        this.obtenerAvisos(() => {
          this.loading = false;
        })
      }
    })

  }
}

