import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import {ExcelService} from '../../../services/excel.service';
import { log } from 'util';

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
  taller: string;

  constructor(private api: ApiService, public dialog: MatDialog, public snackBar: MatSnackBar, private excelService:ExcelService) {
    this.users = [];
    this.talleres = [];
    this.selected = [];
    this.taller="";
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

  getNombreTaller(id){
    this.talleres.forEach(t => {
      if(t.id === id){
        this.taller = t.nombre + "-" + t.sedeDesc;
      }
    });
  }
  
  seleccionarTaller(event: any) {
    this.selected = this.users.filter(x => x.idtaller === event.value);
    this.getNombreTaller(event.value)
  }

  exportAsXLSX():void {
      this.excelService.exportAsExcelFile(this.selected, this.taller);
  }
}
