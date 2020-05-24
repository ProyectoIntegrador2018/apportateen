import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { AddDialog } from 'app/components/add-dialog/add-dialog.component';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AngularFireStorage } from '@angular/fire/storage';


@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.scss']
})
export class PendingComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'voucherLink', 'add'];

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
    this.obtenerPendientes()
  }

  obtenerPendientes() {
    this.vouchers = [];
    this.api.getAllPending().subscribe(result => {
      console.log("LOS PENDIENTES SON:")
      console.log(result);
      this.vouchers = result;
    });
  }

  aceptarComprobante(voucher) {
    console.log("Aceptando el comprobante que tiene como ids:")
    console.log(voucher.user_id)
    console.log(voucher.taller_id)
    let voucherInformation = {
      user_id: voucher.user_id,
      taller_id: voucher.taller_id
    }
    this.api.aceptarComprobante(voucherInformation).subscribe(res => {
      if (res.status === 'success') {
        this.snackbar.open(res.message, '', {
          duration: 5000,
        });
        this.obtenerPendientes();
      }
    }, error => {
      this.snackbar.open(error.error, '', {
        duration: 5000,
      });
    });
  }

  rechazarComprobante(voucher) {
    console.log("Rechazando el comprobante que tiene como ids:")
    this.todeleteUser = voucher.user_id;
    this.todeleteTaller = voucher.taller_id;
    this.comprobanteRef = voucher.ref_comprobante
    this.openDialog()
  }
  fillVouchers() {
    let temp = {}

    for (let i = 0; i < 10; i++) {
      temp = {
        id: "id" + i,
        nombre: "Nombre" + i,
        status: 0,
        voucherLink: "https://www.google.com/",
        date: new Date()
      }
      this.vouchers.push(temp)
    }

  }

  formatDate(date) {
    let months = ["Ene", "Feb", "Marzo", "Abr", "May", "Jun", "Jul", "Ago", "Sept", "Oct", "Nov", "Dic"]

    return `${date.getDate()}/${months[date.getMonth()]}/${date.getFullYear()}`
  }

  verComprobante(url: string) {
    window.open(url, "_blank");
  }

  rechazarComprobanteBack(mensaje) {
    console.log(mensaje)
    console.log(this.todeleteTaller)
    console.log(this.todeleteUser)
    console.log(this.comprobanteRef)

    var archivoRef = this.storage.ref(this.comprobanteRef);
    archivoRef.delete().subscribe(res => {
      let voucherInformation = {
        user_id: this.todeleteUser,
        taller_id: this.todeleteTaller,
        mensaje: mensaje
      }
      this.api.rechazarComprobante(voucherInformation).subscribe(res => {
        if (res.status === 'success') {
          this.snackbar.open(res.message, '', {
            duration: 5000,
          });
          this.obtenerPendientes();
        }
      }, error => {
        this.snackbar.open(error.error, '', {
          duration: 5000,
        });
      });
    }, error => {
      this.snackbar.open('Error', '', {
        duration: 1500,
      });
    });


  }
  openDialog(): void {
    const dialogRef = this.dialog.open(PendingDialog, {
      data: {
        event: "",
        mensaje: ""
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Delete') {
        this.rechazarComprobanteBack(result.data)
      }
    });
  }


}

export interface DialogData {
  mensaje: string;
}

@Component({
  selector: 'pending-dialog',
  template: `
    <div mat-dialog-content>
      <p>Razón por la cual fue rechazado el comprobante</p>
      <mat-form-field>
        <input matInput [(ngModel)]="data.mensaje">
      </mat-form-field>
    </div>
      <div mat-dialog-actions>
        <button mat-flat-button style="margin-right: 30px;" (click)="onNoClick()">Cancelar</button>
        <button mat-flat-button color="warn" (click)="doAction()" cdkFocusInitial>Rechazar el comprobante</button>
      </div>`
})
export class PendingDialog {
  constructor(
    public dialogRef: MatDialogRef<PendingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  doAction() {
    this.dialogRef.close({ event: "Delete", data: this.data.mensaje });
  }
}

