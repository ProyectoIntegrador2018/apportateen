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

  constructor(private api: ApiService,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) {
    this.talleres = [];
    this.isTalleresInscritos = false;
  }

  ngOnInit() {
    this.user = this.storage.get('@user:data');
    this.cargarTalleresInscritos();
  }

  cargarTalleresInscritos() {
    this.api.getTalleresInscritos(this.user.id).subscribe(result => {
      console.log("Talleres insritos");
      console.log(result);
      this.talleres = result;
    });
  }

  imprimirFichaPago() {
    //opcion 1 con css,  pero tendria que poner la clase no print me en el main user component
    window.print();

    //opcion 2
    // var printContents = document.getElementById('fichaPago').innerHTML;
    // var originalContents = document.body.innerHTML;
    // document.body.innerHTML = printContents;
    // window.print();
    // document.body.innerHTML = originalContents;
  }

  toggleButton(direction: String) {
    if (direction == "left") {
      this.isTalleresInscritos = true;
    } else {
      this.isTalleresInscritos = false;
    }
  }

}
