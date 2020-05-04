import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { AddDialog } from 'app/components/add-dialog/add-dialog.component';
import { MatDialog, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.scss']
})
export class PendingComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'date', 'voucherLink', 'add'];

  vouchers: any;


  constructor(private api: ApiService,
   public snackbar: MatSnackBar,
   public dialog: MatDialog) {
    this.vouchers = [];
   }

  ngOnInit() {
    //this.fetchDB();
    this.fillVouchers();
  }

  fillVouchers(){
    let temp = {}

    for(let i = 0; i < 10; i++){
      temp = {
        id: "id"+i,
        nombre: "Nombre"+i,
        status: 0,
        voucherLink: "https://www.google.com/",
        date: new Date()
      }
      this.vouchers.push(temp)
    }

  }

  formatDate(date){
    let months = ["Ene", "Feb", "Marzo", "Abr", "May", "Jun", "Jul", "Ago", "Sept", "Oct", "Nov", "Dic"]

    return `${date.getDate()}/${months[date.getMonth()]}/${date.getFullYear()}`
  }

  verComprobante(url: string){
    window.open(url, "_blank");
  }

  fetchDB() {
    this.api.getUsersUsuarios().subscribe(result => {
      this.vouchers = result;
      console.log(this.vouchers.length);
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
