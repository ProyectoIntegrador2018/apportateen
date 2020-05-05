import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { Sede } from 'app/models/sede.model';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { User } from 'app/models/user.model';
import { Taller } from 'app/models/taller.model';
import { MatDialog, MatSnackBar,MAT_DIALOG_DATA, MatDialogRef, MatSelectModule } from '@angular/material';

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


  cargarTalleres(){
    this.api.getAllTalleres().subscribe(result => {
      this.talleres = result[0];
      console.log(this.talleres);
    });
  }

  cargarTalleresInscritos(){
    this.api.getTalleresInscritos(this.user.id).subscribe(result => {
      console.log("Talleres insritos");
      console.log(result);
      this.talleres = result;
    });
  }

  toggleButton(direction : String){
    if(direction == "left"){
      this.isTalleresInscritos = true;
    } else {
      this.isTalleresInscritos = false;
    }
  }

}
