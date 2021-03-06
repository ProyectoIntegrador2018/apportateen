import { Component, OnInit, Inject } from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import { ApiService } from 'app/services/api/api.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { LOCAL_STORAGE,WebStorageService } from 'angular-webstorage-service';
import { User } from 'app/models/user.model';
import { finalize } from 'rxjs/operators';
import { Archivo } from 'app/models/archivo.model';
import { ConfirmationDialog } from 'app/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-documentos-usuario',
  templateUrl: './documentos-usuario.component.html',
  styleUrls: ['./documentos-usuario.component.scss']
})
export class DocumentosUsuarioComponent implements OnInit {
  archivo : Archivo = new Archivo();
  user : User = new User();
  fileArchivo;
  filePath;
  fileRef;
  nombreArchivo: string;
  listaArchivosImprimir;
  listaArchivoUsuario;

  constructor(private storage: AngularFireStorage,
    private api: ApiService,
    public dialog : MatDialog,
    public snackBar : MatSnackBar,
    @Inject(LOCAL_STORAGE) private webStorage : WebStorageService) { 
      this.listaArchivosImprimir = [];
      this.listaArchivoUsuario = [];
  }

  ngOnInit() {
    this.user = this.webStorage.get('@user:data');
    this.getArchivosAdmn();
    this.getArchivosUser();
  }

  getArchivosAdmn() {
    this.api.getAllArchivosAdmn().subscribe(res => {
      console.log(res[0]);
      this.listaArchivosImprimir = res[0];
    });
  }

  getArchivosUser() {
    this.api.getAllArchivosById(this.user.id).subscribe(res => {
      this.listaArchivoUsuario = res[0];
    })
  }

  getArchivo(event) {
    this.fileArchivo = event.target.files[0];
 }

 uploadDB() {
  this.filePath = this.nombreArchivo + "_" + this.user.id;
  this.fileRef = this.storage.ref(this.filePath);

  this.archivo.user_id = this.user.id;
  this.archivo.nombre = this.nombreArchivo;
  this.archivo.fecha_subida = this.currentDate();
  this.archivo.archivo_path = this.filePath;

  const task = this.storage.upload(this.filePath, this.fileArchivo);
  task.snapshotChanges().pipe(
    finalize(() => {
      this.fileRef.getDownloadURL().subscribe(url=>{
        console.log(url);
        this.archivo.url = url;
        this.api.createArchivoAdmn(this.archivo).subscribe(res => {
          this.snackBar.open(res.message, '', {
            duration: 1300,
          });
          this.getArchivosUser();
        }, error => {
          this.snackBar.open(error.error, '', {
            duration: 1400,
          });
        })
      })
    })
  ).subscribe()

 }

 deleteArchivo(path){
   var archivoRef = this.storage.ref(path);

  const dialogRef = this.dialog.open(ConfirmationDialog, {
    disableClose: true
  });

  dialogRef.componentInstance.mensajeConfirmacion = `Se eliminará este documento. ¿Desea continuar?`;

  dialogRef.afterClosed().subscribe(result => {
    if(result) {
      archivoRef.delete().subscribe(res => {
        this.api.deleteArchivoAdmn(path).subscribe(res => {
          this.snackBar.open(res.message, '', {
            duration: 1300
          });
          this.getArchivosUser();
        }, error => {
          this.snackBar.open(error.error, '', {
            duration: 1300
          });
        })
      })
    }
  })
 }

 currentDate() {
  var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [day, month, year].join('-');
}

}
