import { Component, OnInit } from '@angular/core';
import { Sede } from '../../../models/sede.model';
import { ApiService } from '../../../services/api/api.service';
import { Categoria } from 'app/models/categoria.model';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmationDialog } from 'app/components/confirmation-dialog/confirmation-dialog.component';
import { Taller } from 'app/models/taller.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { discardPeriodicTasks } from '@angular/core/testing';

@Component({
  selector: 'talleres',
  templateUrl: './talleres.component.html',
  styleUrls: ['./talleres.component.scss']
})

export class TalleresComponent implements OnInit {

  newTaller: Taller;
  selectedTaller;
  talleres;
  sedes;
  categorias;
  fileFoto;
  filePath;
  fileRef;

  constructor(private api: ApiService, public dialog: MatDialog, public snackBar: MatSnackBar, private storage : AngularFireStorage) {
    this.talleres = [];
    this.selectedTaller = {};
    this.sedes = [];
    this.categorias = [];
  }

  ngOnInit() {
    this.obtenerTalleres();
  }

  obtenerTalleres() {
    this.api.getAllTalleres().subscribe(result => {
      this.talleres = result[0];
      this.sedes = result[1];
      this.categorias = result[2];
      this.autoSelect();
    });
  }

  add() {
    this.newTaller = new Taller();
    this.selectedTaller = this.newTaller;
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: true
    });
    dialogRef.componentInstance.mensajeConfirmacion = `Se eliminará el taller seleccionado. ¿Desea continuar?`;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        var archivoRef = this.storage.ref(this.selectedTaller.foto_path);
        archivoRef.delete().subscribe(res => {
          this.api.removeTaller(this.selectedTaller.id).subscribe(res => {
            if (res.status == 'success') {
              this.snackBar.open(res.message, '', {
                duration: 900,
              });
              this.obtenerTalleres();
            }
          }, error => {
            this.snackBar.open(error.error, '', {
              duration: 1500,
            });
          });
        })
      }
    });
  }

  save() {

    const dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: true
    });
    dialogRef.componentInstance.mensajeConfirmacion = `Se modificará el taller seleccionado. ¿Desea continuar?`;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.filePath = this.selectedTaller.nombre + "_Foto";
        this.fileRef = this.storage.ref(this.filePath);
        this.selectedTaller.foto_path = this.filePath;
        const task = this.storage.upload(this.filePath, this.fileFoto);

        task.snapshotChanges().pipe(
          finalize(() => {
            this.fileRef.getDownloadURL().subscribe(url => {
              this.selectedTaller.url = url;
              this.api.updateTaller(this.selectedTaller).subscribe(res => {
                this.snackBar.open(res.message, '', {
                  duration: 1000
                });
                this.obtenerTalleres();
              }, error => {
                this.snackBar.open(error.error, '', {
                  duration: 1000
                });
              });
            })
          })
        ).subscribe();
      }
    });
  }

  cancel() {
    this.newTaller = null;
    this.autoSelect();
  }

  create() {

    this.filePath = this.selectedTaller.nombre + "_Foto";
    this.fileRef = this.storage.ref(this.filePath);

    this.selectedTaller.foto_path = this.filePath;

    const task = this.storage.upload(this.filePath, this.fileFoto);

    task.snapshotChanges().pipe(
      finalize(() => {
        this.fileRef.getDownloadURL().subscribe(url => {
          this.selectedTaller.url = url;
          this.newTaller = null;
          this.api.createTaller(this.selectedTaller).subscribe(result => {
            if (result.status == 'success') {
              this.snackBar.open(result.message, '', {
                duration: 1500,
              });
              this.obtenerTalleres();
            }
          }, error => {
            this.snackBar.open(error.error, '', {
              duration: 1500,
            });
          })
              })
            })
    ).subscribe()
  }

  select(taller: Taller) {
    this.selectedTaller = Object.assign({}, taller);
    this.newTaller = null;
  }

  autoSelect() {
    if (this.talleres.length != 0) {
      this.selectedTaller = Object.assign({}, this.talleres[0]);
    }
  }

  getArchivo(event) {
    this.fileFoto = event.target.files[0];
 }

}
