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
  constructor(private api: ApiService,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) {
      this.talleres = [];
    }

  ngOnInit() {
    this.cargarTalleres();
  }


  cargarTalleres(){
    this.api.getAllTalleres().subscribe(result => {
      this.talleres = result[0];
      console.log(this.talleres);
    });
  }

}
