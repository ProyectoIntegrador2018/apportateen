import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { MatDialog, MatSnackBar } from '@angular/material';
@Component({
  selector: 'usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})

export class UsuariosComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'email', 'phone', 'birth', 'curp', 'school', 'tut-name', 'tut-mail', 'grade'];
  users: any;
  talleres: any;
  selected: any;

  constructor(private api: ApiService, public dialog: MatDialog, public snackBar: MatSnackBar) {
    this.users = [];
    this.talleres = [];
    this.selected = [];
  }

  ngOnInit() {
    this.obtenerUsuarios();
    this.obtenerTalleres();
  }

  obtenerUsuarios() {
    this.api.getAllUsers().subscribe(result => {
      this.users = result;
    });
  }

  obtenerTalleres() {
    this.api.getAllTalleres().subscribe(result => {
      this.talleres = result[0];
    });
  }

  seleccionarTaller(event: any) {
    this.selected = this.users.filter(x => x.idtaller === event.value);
  }
}
