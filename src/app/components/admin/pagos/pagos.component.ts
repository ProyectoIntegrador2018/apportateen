import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { AddDialog } from 'app/components/add-dialog/add-dialog.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AngularFireStorage } from '@angular/fire/storage';


@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss']
})
export class PagosComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'voucherLink'];

  vouchers: any;
  todeleteUser: string;
  todeleteTaller: string;
  comprobanteRef: string;

  constructor(private api: ApiService,
    public snackbar: MatSnackBar,
    public dialog: MatDialog, private storage: AngularFireStorage) {
    this.vouchers = [];
  }

  ngOnInit() {
    //this.fetchDB();
    //this.fillVouchers();
    this.obtenerAceptados()
  }

  obtenerAceptados() {
    this.vouchers = [];
    this.api.getAllAccepted().subscribe(result => {
      console.log("LOS PENDIENTES SON:")
      console.log(result);
      this.vouchers = result;
    });
  }


  formatDate(date) {
    let months = ["Ene", "Feb", "Marzo", "Abr", "May", "Jun", "Jul", "Ago", "Sept", "Oct", "Nov", "Dic"]

    return `${date.getDate()}/${months[date.getMonth()]}/${date.getFullYear()}`
  }

  verComprobante(url: string) {
    window.open(url, "_blank");
  }

}

