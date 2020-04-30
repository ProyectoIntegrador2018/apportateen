import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { Sede } from 'app/models/sede.model';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { User } from 'app/models/user.model';
import { Taller } from 'app/models/taller.model';
import { MatDialog, MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ConfirmationDialog } from 'app/components/confirmation-dialog/confirmation-dialog.component';
import { TalleresComponent } from 'app/components/admin/talleres/talleres.component';
import { MessageDialogComponent } from './../../message-dialog/message-dialog.component';

export interface DialogData {

}

@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.component.html',
  styleUrls: ['./inscripcion.component.scss']
})
export class InscripcionComponent implements OnInit {
  estatus: boolean;
  user: User = new User();
  tallerActual;
  talleres;
  sedes;
  selectedSede: Sede = new Sede();
  costosPorEscuela;

  constructor(private api: ApiService,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) {
    this.talleres = [];
    this.sedes = [];
    this.tallerActual = '';
    this.estatus = null;
  }

  ngOnInit() {
    this.user = this.storage.get('@user:data');
    this.cargarSedes();
    this.obtenerCostos();
  }

  cargarSedes() {
    this.api.getEstatusConvocatorias().subscribe(status => {
      this.estatus = status.estatus;
      if (this.estatus) {
        this.api.getAllSedes().subscribe(result => {
          this.sedes = result;
          if (this.user.idtaller != 0) {
            this.obtenerTallerActual();
          }
        })
      }
    })

  }

  obtenerCostos() {
    this.api.getCostos().subscribe(result => {
      this.costosPorEscuela = result;
      console.log(result);
    });
  }

  seleccionarSede(event: any) {
    this.selectedSede = this.sedes.find(x => x.id === event.value);
    this.selectedSede.talleres = this.selectedSede.talleres.filter(x => x.categoria === this.user.idcategoria);
  }

  quitarInscripcion() {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: true
    });
    dialogRef.componentInstance.mensajeConfirmacion = `Se eliminará su inscripción a este taller. ¿Desea continuar?`;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.user.num_conf_pago = "";
        this.api.updateUsuarioNumConfPago(this.user).subscribe(res => {
        }, error => {
          this.snackBar.open(error.error, '', {
            duration: 900,
          });
        });
        this.user.idtaller = 0;
        this.user.id_axtuser = "";
        this.api.updateUser(this.user).subscribe(res => {
          this.storage.set('@user:data', this.user);
          this.tallerActual = '';
          this.snackBar.open(res.message, '', {
            duration: 1500,
          });
        }, error => {
          this.snackBar.open(error.error, '', {
            duration: 900,
          });
        })
      }
    })
  }

  costoTaller(): number {
    if (this.selectedSede.gratis) {
      return 0;
    } else {
      if (this.user.escuela_tipo == "Privada") {
        return this.costosPorEscuela["escuela_privada"];
      } else {
        return this.costosPorEscuela["escuela_publica"];
      }
    }
  }

  inscripcion(taller: Taller) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: true
    });
    let message = `Está por inscribirse al taller ${taller.nombre}. ¿Desea continuar?`;
    if (this.user.idtaller != 0) {
      message = `Se identificó que ya estas registrado en otro taller. Si desea estar inscrito simultáneamente en dos o más talleres, deberas crear un nuevo usuario por cada nuevo registro que deseaa realizar. En caso de querer reemplazar el taller inscrito actual, se reemplazará la inscripción actual por el taller ${taller.nombre}. ¿Desea continuar?`;
    }

    dialogRef.componentInstance.mensajeConfirmacion = message;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.user.idtaller = taller.id;
        this.user.id_axtuser = (this.selectedSede.nombre).toUpperCase() + "-" + (taller.nombre) + taller.inscritos;
        if (this.selectedSede.gratis) {
          this.user.num_conf_pago = "BECA";
          this.api.updateUsuarioNumConfPago(this.user).subscribe(res => {
          }, error => {
            this.snackBar.open(error.error, '', {
              duration: 900,
            });
          });
        }
        this.api.updateUser(this.user).subscribe(res => {
          this.storage.set('@user:data', this.user);
          this.obtenerTallerActual();
          this.cargarSedes();
          if (res.status == "success") {
            const dialogRef = this.dialog.open(MessageDialogComponent, {
              disableClose: true
            });
            if (this.costoTaller() != 0) {
              let message = `Para terminar tu inscripción al taller ${taller.nombre}, necesitarás completar el pago. En tu sección de talleres inscritos, podrás descargar la ficha de pago y subir el comprobante una vez realizado.`;
              dialogRef.componentInstance.mensaje = message;
              dialogRef.componentInstance.titulo = "¡Ya casi estas inscrito!";
            } else {
              let message = `Te has inscrito exitosamente al taller "${taller.nombre}".`;
              dialogRef.componentInstance.mensaje = message;
              dialogRef.componentInstance.titulo = "¡Estas inscrito!";
            }
          } else {
            this.snackBar.open(res.message, '', {
              duration: 1500,
            });
          }
        }, error => {
          this.snackBar.open(error.error, '', {
            duration: 900,
          });
        })
      }
    })
  }

  obtenerTallerActual() {
    let sede = this.sedes.find(sede => sede.talleres.some(item => item.id === this.user.idtaller));
    this.tallerActual = `${sede.talleres.find(x => x.id === this.user.idtaller).nombre} - ${sede.nombre}`;
  }

}
