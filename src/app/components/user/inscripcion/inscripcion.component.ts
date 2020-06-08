import { Component, OnInit, Inject, NgModule } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { Sede } from 'app/models/sede.model';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { User } from 'app/models/user.model';
import { Taller } from 'app/models/taller.model';
import { MatDialog, MatSnackBar, MAT_DIALOG_DATA, MatDialogRef, MatSelectModule } from '@angular/material';
import { ConfirmationDialog } from 'app/components/confirmation-dialog/confirmation-dialog.component';
import { WarningDialogComponent } from 'app/components/warning-dialog/warning-dialog.component';
import { TalleresComponent } from 'app/components/admin/talleres/talleres.component';
import { MessageDialogComponent } from './../../message-dialog/message-dialog.component';
import { AngularFireStorage } from '@angular/fire/storage';

export interface DialogData {

}

@NgModule({
  imports: [MatSelectModule]
})
@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.component.html',
  styleUrls: ['./inscripcion.component.scss']
})
export class InscripcionComponent implements OnInit {
  estatus: boolean;
  user: User = new User();
  talleres;
  sedes;
  selectedSede: Sede = new Sede();
  costosPorEscuela;
  sede_seleccionada: boolean;
  muestra_todos: boolean;
  checa_talleres: boolean;
  talleres_usuario: Taller[];
  muestra_tusuario: boolean;
  sedeselect;


  constructor(private api: ApiService,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private fireStorage: AngularFireStorage) {
    this.talleres = [];
    this.sedes = [];
    this.estatus = null;
    this.sede_seleccionada = null;
    this.muestra_todos = true;

    this.talleres_usuario = [];
    this.checa_talleres = true;
    this.muestra_tusuario;
  }

  ngOnInit() {
    this.user = this.storage.get('@user:data');
    this.cargarSedes();
    this.cargarTalleres();


    this.obtenerCostos();
  }

  cargarSedes() {
    this.api.getEstatusConvocatorias().subscribe(status => {
      this.estatus = status.estatus;
      if (this.estatus) {
        this.api.getAllSedes().subscribe(result => {
          this.sedes = result;
        })
      }
    })

  }

  cargarTalleres() {
    this.api.getAllTalleres().subscribe(result => {
      this.talleres = result[0];
      this.muestra_todos = true;
      this.muestra_tusuario = false;

      
      this.sedeselect = undefined;
      this.cargaTu();
    });

  }

  cargaTu() {

    let t: any;
    this.talleres_usuario = [];

  
    for (t in this.user.talleres) {

      let temp = this.talleres.find(x => x.id === this.user.talleres[t]);

      this.talleres_usuario.push(temp);


    }

  }

  cargarTalleresUsuario() {
    let t: any;


    this.cargaTu();

    this.muestra_todos = false;
    this.muestra_tusuario = true;
    this.sedeselect = undefined;
  }

  obtenerCostos() {
    this.api.getCostos().subscribe(result => {
      this.costosPorEscuela = result;
    });
  }

  seleccionarSede(event: any) {
    this.selectedSede = this.sedes.find(x => x.id === event.value);
    this.selectedSede.talleres = this.selectedSede.talleres.filter(x => x.categoria === this.user.idcategoria);
    this.sede_seleccionada = true;
    this.muestra_todos = false;
    this.muestra_tusuario = false;
  }

  quitarInscripcion(taller: Taller) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: true
    });
    dialogRef.componentInstance.mensajeConfirmacion = `Se eliminará su inscripción a este taller. ¿Desea continuar?`;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.user.id_axtuser = "";

        const index_taller = this.user.talleres.indexOf(taller.id);

        if (index_taller > -1) {
          this.user.talleres.splice(index_taller, 1);
        }

        this.cargaTu();

        //quitar de tabla de inscripciones
        let inscripcion = {
          "taller_id": taller.id,
          "user_id": this.user.id
        }
        //obtener referencia al comprobante de pago
        this.api.getRefComprobante(inscripcion).subscribe(res1 => {
          //quitar inscripcion
          this.api.removeInscripcion(inscripcion).subscribe(res => {
            //borrar archivo del comprobante
            this.borrarComprobanteStorage(res1["ref_comprobante"]);
          }, error => {
            this.snackBar.open(error.error, '', {
              duration: 900,
            });
          });
        }, error => {
          console.log("Error al obtener referencia del comprobante.");
        });

        //quitar taller inscrito de tabla de usuarios
        this.api.updateUser(this.user).subscribe(res => {
          this.storage.set('@user:data', this.user);
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

  //borrar archivo del comprobante de firestorage
  borrarComprobanteStorage(refComprobante: string) {
    if (refComprobante != null && refComprobante != '') {
      var archivoRef = this.fireStorage.ref(refComprobante);
      archivoRef.delete().subscribe(res => {
      }, error => {
        this.snackBar.open('Error', '', {
          duration: 1500,
        });
      });
    }
  }

  //obtener el costo de un taller
  //El costo es gratis si la sede del taller tiene especificado todos sus talleres como gratis. Si no es gratis, el costo del taller depende del tipo de la escuela del usuario
  costoTaller(taller: Taller): number {
    if (taller["gratis"]) {
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

    // sección para checar que el usuario puede inscribir otro taller dependiendo del horario y fecha de los talleres que ya tiene inscritos
    let t: any;
    for (t in this.talleres_usuario) {

      // let tall = this.talleres.find(x => x.id === this.user.talleres[t]);

      var fi = this.talleres_usuario[t].fecha_inicio.slice(0, 10);
      var ff = this.talleres_usuario[t].fecha_fin.slice(0, 10);
      var fi_n = taller.fecha_inicio.slice(0, 10);
      var ff_n = taller.fecha_fin.slice(0, 10);

      fi = fi.split("-").join("");
      ff = ff.split("-").join("");
      fi_n = fi_n.split("-").join("");
      ff_n = ff_n.split("-").join("");

      var hi = this.talleres_usuario[t].hora_inicio.replace(":", "");
      var hf = this.talleres_usuario[t].hora_fin.replace(":", "");
      var hi_n = taller.hora_inicio.replace(":", "");
      var hf_n = taller.hora_fin.replace(":", "");

      // checar si los rangos de fechas del nuevo taller a inscribir estan dentro de los rangos de fechas de los talleres ya inscritos
      // TODO: más pruebas de esto

      if ((fi_n >= fi && ff >= fi_n) || (ff_n >= fi && ff >= ff_n)) {
        // checa si las horas del nuevo taller coinciden dentro de las horas de los talleres que ya tiene inscritos

        if ((hi_n >= hi && hf >= hi_n) || (hf_n >= hi && hf >= hf_n) || taller.estado != this.talleres_usuario[t].estado) {
          this.checa_talleres = false;
        }
      }

    }


    let dialogRef, message;

    if (!this.checa_talleres) {
      dialogRef = this.dialog.open(WarningDialogComponent);

    } else {

      dialogRef = this.dialog.open(ConfirmationDialog, {
        disableClose: true
      });

      message = `Está por inscribirse al taller ${taller.nombre} en el estado de ${taller.estado}. ¿Desea continuar?`;
      dialogRef.componentInstance.mensajeConfirmacion = message;
    }

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.checa_talleres) {

        this.user.talleres.push(taller.id);

        this.cargaTu();

        this.user.id_axtuser = (this.selectedSede.nombre).toUpperCase() + "-" + (taller.nombre) + taller.inscritos;

        ///======== inscribir a tabla de Inscripciones
        let inscripcion = {
          "tallerId": taller.id,
          "userId": this.user.id
        }

        this.api.createInscripcion(inscripcion).subscribe(res => {
        }, error => {
          this.snackBar.open(error.error, '', {
            duration: 900,
          });
        })
        // =============

        //inscribir taller en tabla de usuarios
        this.api.updateUser(this.user).subscribe(res => {
          this.storage.set('@user:data', this.user);
          // this.obtenerTallerActual();
          this.cargarSedes();
          if (res.status == "success") {
            const dialogRef = this.dialog.open(MessageDialogComponent, {
              disableClose: true
            });
            if (this.costoTaller(taller) != 0) {
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
      } else {
        this.checa_talleres = true; //resetea valor
      }
    })
  }
}
