import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmationDialog } from 'app/components/confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'patrocinadores',
  templateUrl: './patrocinadores.component.html',
  styleUrls: ['./patrocinadores.component.scss']
})

export class PatrocinadoresComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'email', 'actions'];
  sponsors;

  constructor(private api: ApiService, public dialog: MatDialog, public snackBar: MatSnackBar) {
    this.sponsors = [];
  }

  ngOnInit() {
    this.obtenerPatrocinadores();
  }

  obtenerPatrocinadores() {
    this.api.getAllSponsors().subscribe(result => {
      this.sponsors = result;
    });
  }

  eliminar(id: number) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: true
    });
    dialogRef.componentInstance.mensajeConfirmacion = `Se eliminará el patrocinador seleccionado. ¿Desea continuar?`;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.removeSponsor(id).subscribe(res => {
          this.obtenerPatrocinadores();
          this.snackBar.open(res.message, '', {
            duration: 900,
          });
        }, error => {
          this.snackBar.open(error.error, '', {
            duration: 900,
          });
        });
      }
    });
  }
}
