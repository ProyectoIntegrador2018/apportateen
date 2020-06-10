import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ExcelService } from 'app/services/excel.service';
import { ConfirmationDialog } from 'app/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-administracion-roles',
  templateUrl: './administracion-roles.component.html',
  styleUrls: ['./administracion-roles.component.scss']
})
export class AdministracionRolesComponent implements OnInit {

  displayColumns1 : string [] = ['position', 'name', 'email', 'add'];
  displayColumns2 : string[] = ['position', 'name', 'email', 'remove'];

  users : any;
  usersAdmn : any;

  constructor(private api: ApiService,
    public dialog : MatDialog,
    public snackBar: MatSnackBar) {
      this.users = [];
      this.usersAdmn = [];
    }

  ngOnInit() {
    this.fetchDB();
  }

  fetchDB() {
    this.obtenerUserAdmn();
    this.obtenerUserUsuarios();
  }

  obtenerUserUsuarios() {
    this.api.getUsersUsuarios().subscribe(result => {
      this.users=[];
      this.users = result;
      console.log(result)
    });
  }

  obtenerUserAdmn() {
    this.usersAdmn=[];
    this.api.getUsersAdmn().subscribe(result => {
      this.usersAdmn = result;
    })
  }

  removerAdmn(id) {
    const message= "Se eliminara al usuario como Administrador. ¿Desea continuar?";

    const dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: true
    });

    dialogRef.componentInstance.mensajeConfirmacion = message;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.deleteAdmin(id).subscribe(res => {
          if(res.status == 'success') {
            this.snackBar.open(res.message, '', {
              duration: 2000,
            });
            this.fetchDB();
          }
        }, error => {
          this.snackBar.open(error.error, '', {
            duration: 2000,
          });
        });
      }
    });
  }

  agregarAdmn(user) {
    const message= "Se agregara al usuario como Administrador. ¿Desea continuar?";

    const dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: true
    });

    dialogRef.componentInstance.mensajeConfirmacion = message;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.addAdmin(user).subscribe(res => {
          if(res.status == 'success') {
            this.snackBar.open(res.message, '', {
              duration: 2000,
            });
            this.fetchDB();
          }
        }, error => {
          this.snackBar.open(error.error, '', {
            duration: 2000,
          });
        });
      }
    });
  }

}
