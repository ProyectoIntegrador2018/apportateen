import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { Sede } from 'app/models/sede.model';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { User } from 'app/models/user.model';
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

  constructor(private api: ApiService,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) {
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
