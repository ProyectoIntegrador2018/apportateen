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

  loading = true;
  initialLoading = false;

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
    this.loading = true;
    this.api.getAllSedes().subscribe(result => {
      this.sedes = result;
      this.autoSelect();
      this.loading = false;
      this.initialLoading = true;
    });
  }

  add() {
    this.newSede = new Sede();
    this.selectedSede = this.newSede;
  }

  delete() {
    // Delete the selected Sede
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: true
    });
    dialogRef.componentInstance.mensajeConfirmacion = `Se eliminará la información de la sede: ${this.selectedSede.nombre.toUpperCase()}. ¿Desea continuar?`;
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // If the admin confirmed the deletion of the Sede, then proceed
        this.loading = true;
        
        // First delete the Sede
        this.api.removeSede(this.selectedSede.id).subscribe(res => {
          if (res.status == 'success') {
            if (this.originalInfoSede.responsable != null) {
              // If the Sede has a Responsable, then delete the Responsable
              this.api.deleteResponsable(this.selectedSede.responsable).subscribe(_ => { }, _ => {
                this.snackBar.open("Error al eliminar el responsable de la sede.", '', {
                  duration: 3000
                });
                this.loading = false;
              })
            }
            this.obtenersedes();
          }
          this.snackBar.open(res.message, '', {
            duration: 3000,
          });
        }, error => {
          var errMessage = 'Ha sucedido un error eliminando la sede'
          if (this.selectedSede.talleres.length > 0) {
            errMessage = `Error. No se pueden eliminar sedes con talleres`
          }
          this.snackBar.open(errMessage, 'Ayuda', {
            duration: 3000
          }).onAction().subscribe(() => {
            this.snackBar.open('Primero se deben eliminar o asignar los talleres registrados en esta sede a otra. Solo se pueden eliminar sedes que no cuentan con talleres.', 'OK', {});
            this.loading = false;
          });
        }
        );
      }
    });
  }

  updatesede(next?) {
    // Update de la sede
    this.api.updateSede(this.selectedSede).subscribe(res => {
      this.snackBar.open(res.message, '', {
        duration: 3000
      });
      if (next != undefined) {
        next()
      }
      this.obtenersedes();
    }, error => {
      this.snackBar.open(error.error, '', {
        duration: 3000
      });
      this.loading = false;
    });
  }

  save() {
    // Save the selected sede with the new changes.
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: true
    });
    dialogRef.componentInstance.mensajeConfirmacion = `Se modificará la sede seleccionada. ¿Desea continuar?`;

    dialogRef.afterClosed().subscribe(result => {
      // If the admin confirmed the save action, then proceed to save the selected Sede changes
      if (result) {
        this.loading = true;
        if (this.originalInfoSede.correo_responsable != null) {
          // La sede ya tenía responsable
          if (this.selectedSede.correo_responsable == "") {
            // Se elimino el responsable
            this.selectedSede.responsable = null
            let deleteResponsable = () => {
              this.api.deleteResponsable(this.originalInfoSede.responsable).subscribe(res => { }, error => {
                this.snackBar.open('Problema al eliminar el responsable', '', {
                  duration: 3000
                });
                this.loading = false;
              })
            }
            this.updatesede(deleteResponsable)
          }
          else if (this.originalInfoSede.correo_responsable != this.selectedSede.correo_responsable || this.originalInfoSede.nombre_responsable != this.selectedSede.nombre_responsable) {
            // Se tiene que hacer update al responsable
            var data = new Responsable
            data.id_responsable = this.selectedSede.id_responsable
            data.nombre_responsable = this.selectedSede.nombre_responsable
            data.correo_responsable = this.selectedSede.correo_responsable

            this.api.updateResponsable(data).subscribe(res => {
              this.updatesede()
            }, error => {
              this.snackBar.open('Problema al actualizar el responsable', '', {
                duration: 3000
              });
              this.loading = false;
            })
          }
          else {
            // No se modificó el responsable actual
            this.updatesede()
          }
        }
        else if (this.selectedSede.correo_responsable != "" && this.selectedSede.correo_responsable != null) {
          // No tiene responsable y se agregó uno
          var data = new Responsable
          data.id_responsable = null
          data.nombre_responsable = this.selectedSede.nombre_responsable
          data.correo_responsable = this.selectedSede.correo_responsable

          this.api.createResponsable(data).subscribe(res => {
            this.api.getReponsable(this.selectedSede).subscribe(res => {
              this.selectedSede.responsable = res.id_responsable;
              this.updatesede()

            }, error => {
              this.snackBar.open("Error al obtener el responsable", '', {
                duration: 3000
              });
              this.loading = false;
            })
          }, error => {
            this.snackBar.open("Error al crear responsable", '', {
              duration: 3000
            });
            this.loading = false;
          })

        } else {
          // No se modificó el responsable  
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
    // Create a new Sede
    this.loading = true;
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
                duration: 3000,
              });
              this.obtenersedes();
            }
          }, error => {
            this.snackBar.open("Ha ocurrido un error, intente de nuevo por favor", '', {
              duration: 3000,
            });
            this.autoSelect();
            this.loading = false;
          })
        }, error => {
          this.snackBar.open("Ha ocurrido un error con el responsable, intende de nuevo por favor.", '', {
            duration: 3000,
          });
          this.autoSelect();
          this.loading = false;
        });
      }, error => {
        this.snackBar.open("Ha ocurrido un error al registrar el responsable, intende de nuevo por favor.", '', {
          duration: 3000,
        });
        this.autoSelect();
        this.loading = false;
      });
    }
    else {
      // La sede no tiene responsable
      this.selectedSede.responsable = null
      this.api.createSede(this.selectedSede).subscribe(result => {
        if (result.status == 'success') {
          this.snackBar.open(result.message, '', {
            duration: 3000,
          });
          this.obtenersedes();
        }
      }, error => {
        this.snackBar.open("Ha ocurrido un error, intente de nuevo por favor", '', {
          duration: 3000,
        });
        this.autoSelect();
        this.loading = false;
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

}
