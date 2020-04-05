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
  fileFotoAr;
  filePathAr;
  fileRefAr;

  constructor(private api: ApiService, public dialog: MatDialog, public snackBar: MatSnackBar, private storage: AngularFireStorage) {
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
      console.log(this.talleres)
      this.sedes = result[1];
      this.categorias = result[2];
      this.autoSelect();
    });
  }

  add() {
    this.newTaller = new Taller();
    this.selectedTaller = this.newTaller;
  }

  deleteImage(urlToDelete) {
    console.log(urlToDelete);
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
        for (let i = 0; i < this.fileFotoAr.length; i++) {
          this.filePathAr.push(this.selectedTaller + "_Foto_" + i)
          this.fileRef.push(this.storage.ref(this.filePath))
        }
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
    Promise.all(
      Object.keys(this.fileFotoAr).map((item, index) => this.uploadPhotosCreate(this.fileFotoAr[item], index))).then((url) => {
        console.log("success");
        this.api.createTaller(this.selectedTaller).subscribe(res => {
          this.snackBar.open(res.message, '', {
            duration: 1000
          });
          this.obtenerTalleres();
          this.fileFotoAr = [];
          this.filePathAr = []
        }, error => {
          this.snackBar.open(error.error, '', {
            duration: 1000
          });
        });
      }).catch((error) => {
        console.log(error);
        console.log("Error");
      })

  }

  newDelete() {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: true
    });
    dialogRef.componentInstance.mensajeConfirmacion = `Se eliminará el taller seleccionado. ¿Desea continuar?`;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Promise.all(
          this.selectedTaller.foto_path_array.map(item => this.deleteAllPhotos(item))).then((url) => {
            console.log("success");
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
          }).catch((error) => {
            console.log(error);
            console.log("Error");
          })
      }
    });
  }

  deleteAllPhotos(fotoPath) {
    return new Promise<any>((resolve, reject) => {
      console.log("FOTO PATH IS:");
      console.log(fotoPath);
      var archivoRef = this.storage.ref(fotoPath);
      archivoRef.delete().subscribe(res => {
        resolve(true)
      })
    })
  }

  uploadPhotosSave(file, index) {
    return new Promise<any>((resolve, reject) => {
      const task = this.storage.upload(this.filePathAr[index], file);
      let fileRef = this.storage.ref(this.filePathAr[index]);
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.selectedTaller.url_array.push(url);
            this.selectedTaller.foto_path_array.push(this.filePathAr[index])
            console.log("Pushing into local obj");
          })
        })
      ).subscribe()
    })
  }

  uploadPhotosCreate(file, index) {
    return new Promise<any>((resolve, reject) => {
      const task = this.storage.upload(this.filePathAr[index], file);
      let fileRef = this.storage.ref(this.filePathAr[index]);
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.selectedTaller.url_array.push(url);
            this.selectedTaller.foto_path_array.push(this.filePathAr[index])
            resolve(true);
          })
        })
      ).subscribe()
    })
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

  getArchivos(event) {
    this.fileFoto = event.target.files[0];
    this.fileFotoAr = event.target.files;
    this.filePathAr = Object.keys(this.fileFotoAr).map((key) => this.fileFotoAr[key].name)
  }

}
