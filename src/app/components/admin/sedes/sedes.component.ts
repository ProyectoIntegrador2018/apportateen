import { Component, OnInit } from '@angular/core';
import { Sede } from '../../../models/sede.model';
import { Responsable } from '../../../models/responsable.model';
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
  originalInfoSede: Sede;
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
      console.log(result);
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

  updatesede() {
    console.log("UPADTING SEDE")
    // Update de la sede
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

  save() {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: true
    });
    dialogRef.componentInstance.mensajeConfirmacion = `Se modificará la sede seleccionada. ¿Desea continuar?`;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.originalInfoSede.correo_responsable != null) {
          // La sede ya tenía responsable
          console.log("SEDE CON RESPONSABLE")
          if (this.selectedSede.correo_responsable == "") {
            // Se elimino el responsable
            console.log("ELIMINAR AL RESPONSABLE")
          }
          else if (this.originalInfoSede.correo_responsable != this.selectedSede.correo_responsable || this.originalInfoSede.nombre_responsable != this.selectedSede.nombre_responsable) {
            console.log("UPDATE AL RESPONSABLE")
            // Se tiene que hacer update al responsable
            var data = new Responsable
            data.id_responsable = this.selectedSede.id_responsable
            data.nombre_responsable = this.selectedSede.nombre_responsable
            data.correo_responsable = this.selectedSede.correo_responsable

            this.api.updateResponsable(data).subscribe(res => {
              this.updatesede()
            }, error => {
              this.snackBar.open('Problema al actualizar el responsable', '', {
                duration: 1000
              });
            })
          }
        }
        else if (this.selectedSede.correo_responsable != "" && this.selectedSede.correo_responsable != null) {
          // No tiene responsable y se agregó uno
          console.log("AGREGAR AL RESPONSABLE")
          var data = new Responsable
          data.id_responsable = null
          data.nombre_responsable = this.selectedSede.nombre_responsable
          data.correo_responsable = this.selectedSede.correo_responsable

          this.api.createResponsable(data).subscribe(res => {
            this.api.getReponsable(this.selectedSede).subscribe(res => {
              this.selectedSede.responsable = res.id_responsable;
              this.updatesede()

            }, error => {
              console.log(error.error)
              this.snackBar.open("Error al obtener el responsable", '', {
                duration: 1000
              });
            })
          }, error => {
            console.log(error.error)
            this.snackBar.open("Error al crear responsable", '', {
              duration: 1000
            });
          })

        } else {
          // No se modifico el responsable
          this.updatesede()
        }
      }
    });
  }

  cancel() {
    this.newSede = null;
    this.autoSelect();
  }

  create() {
    this.newSede = null;

    // Checar si la sede tiene responsable
    if (this.selectedSede.correo_responsable != "") {
      var responsable = new Responsable
      responsable.id_responsable = this.selectedSede.id_responsable
      responsable.nombre_responsable = this.selectedSede.nombre_responsable
      responsable.correo_responsable = this.selectedSede.correo_responsable

      this.api.createResponsable(responsable).subscribe(res => {
        this.api.getReponsable(this.selectedSede).subscribe(res_id => {
          this.selectedSede.responsable = res_id.id_responsable;
          this.api.createSede(this.selectedSede).subscribe(result => {
            if (result.status == 'success') {
              this.snackBar.open(result.message, '', {
                duration: 1500,
              });
              this.obtenersedes();
            }
          }, error => {
            this.snackBar.open("Ha ocurrido un error, intente de nuevo por favor", '', {
              duration: 1500,
            });
            this.autoSelect();
          })
        }, error => {
          console.log("Error al encontrar el responsable")
          this.snackBar.open("Ha ocurrido un error con el responsable, intende de nuevo por favor.", '', {
            duration: 1500,
          });
          this.autoSelect();
        });
      }, error => {
        console.log("Error al registrar el responsable")
        this.snackBar.open("Ha ocurrido un error al registrar el responsable, intende de nuevo por favor.", '', {
          duration: 1500,
        });
        this.autoSelect();
      });
    }
    else {
      // La sede no tiene responsable
      this.selectedSede.responsable = null
      this.api.createSede(this.selectedSede).subscribe(result => {
        if (result.status == 'success') {
          this.snackBar.open(result.message, '', {
            duration: 1500,
          });
          this.obtenersedes();
        }
      }, error => {
        this.snackBar.open("Ha ocurrido un error, intente de nuevo por favor", '', {
          duration: 1500,
        });
        this.autoSelect();
      })

    }
  }

  select(sede: Sede) {
    this.selectedSede = Object.assign({}, sede);
    this.newSede = null;
    this.originalInfoSede = Object.assign({}, this.selectedSede)
  }

  autoSelect() {
    if (this.sedes.length != 0) {
      this.selectedSede = Object.assign({}, this.sedes[0]);
      this.originalInfoSede = Object.assign({}, this.selectedSede)
    }
  }

  show() {
    console.log(this.selectedSede)
    console.log(this.originalInfoSede)
  }

}
