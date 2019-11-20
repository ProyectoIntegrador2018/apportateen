import { Component, OnInit } from '@angular/core';
import { Sede } from '../../../models/sede.model';
import { ApiService } from '../../../services/api/api.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmationDialog } from 'app/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'sedes',
  templateUrl: './sedes.component.html',
  styleUrls: ['./sedes.component.scss']
})

export class SedesComponent implements OnInit {

  newSede: Sede;
  selectedSede;
  sedes = [];

  constructor(private api: ApiService, public dialog: MatDialog, public snackBar: MatSnackBar) {
    this.sedes = [];
    this.selectedSede = {};
  }

  ngOnInit() {
    this.obtenersedes();
  }

  obtenersedes() {
    this.api.getAllSedes().subscribe(result => {
      this.sedes = result;
      this.autoSelect();
    });
  }

  add() {
    this.newSede = new Sede();
    this.selectedSede = this.newSede;
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: true
    });
    dialogRef.componentInstance.mensajeConfirmacion = `Se eliminará la sede seleccionada. ¿Desea continuar?`;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.removeSede(this.selectedSede.id).subscribe(res => {
          if (res.status == 'success') {
            this.obtenersedes();
          }
          this.snackBar.open(res.message, '', {
            duration: 1000,
          });
        }, error => {
          var errMessage = 'Ha sucedido un error eliminando la sede.'
          if (error.error.indexOf('update or delete on table') > 0) {
            errMessage = 'Error. Esta sede esta asignada a algún taller.'
          }
          this.snackBar.open(errMessage, '', {
            duration: 1500,
          });
        });
      }
    });
  }

  save() {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: true
    });
    dialogRef.componentInstance.mensajeConfirmacion = `Se modificará la sede seleccionada. ¿Desea continuar?`;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.updateSede(this.selectedSede).subscribe(res => {
          this.snackBar.open(res.message, '', {
            duration: 1000
          });
          this.obtenersedes();
        }, error => {
          this.snackBar.open(error.error, '', {
            duration: 1000
          });
        });
      }
    });
  }

  cancel() {
    this.newSede = null;
    this.autoSelect();
  }

  create() {
    this.newSede = null;
    this.api.createSede(this.selectedSede).subscribe(result => {
      if (result.status == 'success') {
        this.snackBar.open(result.message, '', {
          duration: 1500,
        });
        this.obtenersedes();
      }
    }, error => {
      this.snackBar.open(error.error, '', {
        duration: 1500,
      });
    })
  }

  select(sede: Sede) {
    this.selectedSede = Object.assign({}, sede);
    this.newSede = null;
  }

  autoSelect() {
    if (this.sedes.length != 0) {
      this.selectedSede = Object.assign({}, this.sedes[0]);
    }
  }

}
