import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { Sede } from 'app/models/sede.model';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { User } from 'app/models/user.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Taller } from 'app/models/taller.model';
import { MatDialog, MatSnackBar, MAT_DIALOG_DATA, MatDialogRef, MatSelectModule } from '@angular/material';

@Component({
  selector: 'app-talleres-inscritos',
  templateUrl: './talleres-inscritos.component.html',
  styleUrls: ['./talleres-inscritos.component.scss']
})
export class TalleresInscritosComponent implements OnInit {

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
      console.log("Talleres insritos");
      console.log(result);
      this.talleres = result;
    });
  }


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
  fileInput(files: FileList, taller: Taller) {
    this.comprobante = files.item(0);
    console.log("INPUT FILE");
    console.log(this.comprobante);
    console.log(this.comprobante.name);
    console.log(taller);
    this.uploadComprobante(taller);
}

  //subir a firestorage
  uploadComprobante(taller: Taller) {
    return new Promise<any>((resolve, reject) => {
      var fileId = this.comprobante.name + '-' + this.user.id + '_' + taller.fecha_inicio.substring(0,4) + Math.random().toString(36).substring(4);
      //la referencia al comprobante esta compuesto por el nombre, id del usuario, y un numero random. AGREGAR FECHA
      const task = this.fireStorage.upload(fileId , this.comprobante);
      let fileRef = this.fireStorage.ref(fileId);
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            console.log(url);
            resolve(true)
          })
        })
      ).subscribe()
    })
  }


  imprimirFichaPago(taller: Taller) {
    //opcion 1 con css
    // this.print = false;
    // // this.currentCost = this.costoTaller(taller);
    // this.currentCost = 500;
    // this.print = true;
    window.print();
  }

  toggleButton(direction: String) {
    if (direction == "left") {
      this.isTalleresInscritos = true;
    } else {
      this.isTalleresInscritos = false;
    }
  }

}
