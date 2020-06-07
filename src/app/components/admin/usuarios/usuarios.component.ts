import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import {ExcelService} from '../../../services/excel.service';
import { log } from 'util';
import {UsuariosDetalleComponent} from './usuarios-detalle/usuarios-detalle.component';
import { ConfirmationDialog } from 'app/components/confirmation-dialog/confirmation-dialog.component';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})

export class UsuariosComponent implements OnInit {
  displayedColumns: string[] = ['position', 'id_Axt@Teen','name', 'email','school', 'grade', 'documentos', 'delete'];
  users: any;
  talleres: any;
  selected: any;
  taller: string;

  constructor(private api: ApiService, public dialog: MatDialog, public snackBar: MatSnackBar, private excelService:ExcelService, private firebaseAuth: AngularFireAuth) {
    this.users = [];
    this.talleres = [];
    this.selected = [];
    this.taller="";
  }

  ngOnInit() {
    this.fetchDB();
  }

  fetchDB() {
    this.obtenerUsuarios();
    this.obtenerTalleres();
  }

  obtenerUsuarios() {
    this.api.getAllUsers().subscribe(result => {
      this.users = result;
      this.selected= result;
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

  // seleccionarTaller(event: any) {
  //   if(event.value != 0) {
  //     this.selected = this.users.filter(x => x.idtaller === event.value);
  //     this.getNombreTaller(event.value)
  //   } else {
  //     this.obtenerUsuarios();
  //   }
  // }

  deleteUser(id) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose : true
    });

    dialogRef.componentInstance.mensajeConfirmacion = `Se eliminará el usuario seleccionado. ¿Desea continuar?`;

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
          this.api.removeUser(id).subscribe(res => {
            if(res.status == 'success') {
              this.snackBar.open(res.message,'', {
                duration: 1000,
              });
              this.fetchDB();
            }
          }, error => {
            this.snackBar.open(error.error,'', {
              duration: 1500,
            });
          });
      }
    });

  }

  exportAsXLSX():void {
      this.excelService.exportAsExcelFile(this.selected, "Usuarios ApportaTeen");
  }

  openDetalle(row, usuario) {
    let dialogDetalle = this.dialog.open(UsuariosDetalleComponent, {
      width: '800px',
      data: {row, usuario}
    });
    dialogDetalle.afterClosed().subscribe(result => {
      this.fetchDB();
    });
  }


}
