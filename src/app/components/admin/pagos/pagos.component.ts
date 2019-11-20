import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { AddDialog } from 'app/components/add-dialog/add-dialog.component';
import { MatDialog, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss']
})
export class PagosComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'NumConfPago', 'add'];

  users: any;


  constructor(private api: ApiService,
   public snackbar: MatSnackBar,
   public dialog: MatDialog) {
    this.users = [];
   }

  ngOnInit() {
    this.fetchDB();
  }

  fetchDB() {
    this.api.getUsersUsuarios().subscribe(result => {
      this.users = result;
      console.log(this.users.length);
    });
  }

  agregarPago(user) {
    const message = 'Número de confirmación de pago:';

    const dialogRef = this.dialog.open(AddDialog, {
      data: {mensaje: message, num_de_conf: user.num_conf_pago}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        user.num_conf_pago = result;
        this.api.updateUsuarioNumConfPago(user).subscribe(res => {
          if (res.status === 'success') {
            this.snackbar.open(res.message, '', {
              duration: 5000,
            });
            this.fetchDB();
          }
        }, error => {
          this.snackbar.open(error.error, '', {
            duration: 5000,
          });
        });
      }
    });
  }

}
