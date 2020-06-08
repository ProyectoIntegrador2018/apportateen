import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { Sede } from 'app/models/sede.model';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { User } from 'app/models/user.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Taller } from 'app/models/taller.model';
import { ConfirmationDialog } from 'app/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog, MatSnackBar, MAT_DIALOG_DATA, MatDialogRef, MatSelectModule } from '@angular/material';
import { ViewChild, ViewChildren, QueryList } from '@angular/core';
import { AfterViewInit, ElementRef } from '@angular/core'

@Component({
  selector: 'app-talleres-inscritos',
  templateUrl: './talleres-inscritos.component.html',
  styleUrls: ['./talleres-inscritos.component.scss']
})
export class TalleresInscritosComponent implements OnInit {


  @ViewChildren('comprobantes') inputs: QueryList<ElementRef>;
  @ViewChildren('labelComprobantes') labels: QueryList<ElementRef>;

  talleres;
  isTalleresInscritos;
  user: User = new User();
  currentCost;
  print;
  comprobante: File = null;

  constructor(private api: ApiService,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private fireStorage: AngularFireStorage) {
    this.talleres = [];
    this.isTalleresInscritos = false;
    this.print = true;
  }

  //para un usuario, todos los talleres tienen el mismo costo porque depende de su tipo de escuela, y los que sono gratis ya estaran en la seccion de talleres inscritos
  ngOnInit() {
    this.user = this.storage.get('@user:data');
    this.cargarTalleresInscritos();
    this.obtenerCostos();
  }

  cargarTalleresInscritos() {
    this.api.getTalleresInscritos(this.user.id).subscribe(result => {
      this.talleres = result;
    });
  }

  //obtener el costo de un taller
  //El costo es gratis si la sede del taller tiene especificado todos sus talleres como gratis. Si no es gratis, el costo del taller depende del tipo de la escuela del usuario
  obtenerCostos() {
    this.api.getCostos().subscribe(result => {
      let costosPorEscuela = result;
      if (this.user.escuela_tipo == "Privada") {
        this.currentCost = costosPorEscuela["escuela_privada"];
      } else {
        this.currentCost = costosPorEscuela["escuela_publica"];
      }
    });
  }

  //sube un archivo el usuario
  fileInput(event, taller: Taller) {
        this.comprobante = event.target.files.item(0);
        this.uploadComprobante(taller);
  }

  hasTallerWithStatus(estatus: String) {
    for (let taller of this.talleres) {
      if (taller["estatus"] == estatus) {
        return true;
      }
    }
    return false;
  }

  getNombreArchivo(taller: Taller): string {
    if (taller["ref_comprobante"] != null && taller["ref_comprobante"] != "") {
      return taller["ref_comprobante"].substr(0, taller["ref_comprobante"].lastIndexOf('-'));
    }
    return "Escoger Archivo";
  }

  //subir a firestorage
  uploadComprobante(taller: Taller) {
    return new Promise<any>((resolve, reject) => {
      var fileId = this.comprobante.name + '-' + this.user.id + '_' + taller.fecha_inicio.substring(0, 4) + Math.random().toString(36).substring(3);
      //la referencia al comprobante esta compuesto por el nombre, id del usuario, y un numero random y la fecha del evento
      const task = this.fireStorage.upload(fileId, this.comprobante);
      let fileRef = this.fireStorage.ref(fileId);
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            console.log(url);

            //si ya tiene un comprobante, borrarlo de firestorage
            this.borrarComprobanteStorage(taller);

            //Subir a la base de datos
            var inscripcion = {
              'user_id': this.user.id,
              'taller_id': taller.id,
              'comprobante': url,
              'ref_comprobante': fileId
            };
            this.api.subirComprobante(inscripcion).subscribe(res => {
              taller["comprobante"] = url;
              taller["ref_comprobante"] = fileId;
              taller["estatus"] = 'en revision';
              this.snackBar.open(res.message, '', {
                duration: 1500,
              });
            }, error => {
              this.snackBar.open(error.error, '', {
                duration: 900,
              });
            })

            resolve(true)
          })
        })
      ).subscribe()
    })
  }

  //borrar archivo del comprobante de firestorage
  borrarComprobanteStorage(taller: Taller) {
    if (taller["ref_comprobante"] != null && taller["ref_comprobante"] != '') {
      var archivoRef = this.fireStorage.ref(taller["ref_comprobante"]);
      archivoRef.delete().subscribe(res => {
      }, error => {
        this.snackBar.open('Error', '', {
          duration: 1500,
        });
      });
    }
  }


  imprimirFichaPago(taller: Taller) {
    window.print();
  }

  toggleButton(direction: String) {
    if (direction == "left") {
      this.isTalleresInscritos = true;
    } else {
      this.isTalleresInscritos = false;
    }
  }

  quitarInscripcion(taller: Taller) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: true
    });
    dialogRef.componentInstance.mensajeConfirmacion = `Se eliminará su inscripción a este taller. ¿Desea continuar?`;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.user.id_axtuser = "";

        //desinscribir de tabla de inscripciones
        const inscripcion = {
          "taller_id": taller.id,
          "user_id": this.user.id
        }
        this.api.removeInscripcion(inscripcion).subscribe(res => {
          this.cargarTalleresInscritos();
          //borrar de firestorage el comprobante
          this.borrarComprobanteStorage(taller);
          this.snackBar.open(res.message, '', {
            duration: 1500,
          });
        }, error => {
          this.snackBar.open(error.error, '', {
            duration: 900,
          });
        });
        //tabla usuarios borrar inscripcion
        const index_taller = this.user.talleres.indexOf(taller.id);
        if (index_taller > -1) {
          this.user.talleres.splice(index_taller, 1);
        }
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

}
