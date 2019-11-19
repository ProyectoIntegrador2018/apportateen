import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { Categoria } from 'app/models/categoria.model';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmationDialog } from 'app/components/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})

export class CategoriasComponent implements OnInit {

  newCat: Categoria;
  selectedCat;
  categorias = [];

  constructor(private api: ApiService, public dialog: MatDialog, public snackBar: MatSnackBar) {
    this.categorias = [];
    this.selectedCat = {};
  }

  ngOnInit() {
    this.obtenerCategorias();
  }

  obtenerCategorias() {
    this.api.getAllCategorias().subscribe(result => {
      this.categorias = result;
      this.autoSelect();
    });
  }

  add() {
    this.newCat = new Categoria();
    this.selectedCat = this.newCat;
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: true
    });
    dialogRef.componentInstance.mensajeConfirmacion = `Se eliminará la categoría seleccionada. ¿Desea continuar?`;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.removeCategoria(this.selectedCat.id).subscribe(res => {
          if (res.status === 'success') {
            this.obtenerCategorias();
          }
          this.snackBar.open(res.message, '', {
            duration: 900,
          });
        }, error => {
          let errMessage = 'Ha sucedido un error eliminando la categoría.';
          if (error.error.indexOf('update or delete on table') > 0) {
            errMessage = 'Esta categoría esta asignada a algún taller.';
          }
          this.snackBar.open(errMessage, '', {
            duration: 1500,
          });
        });
      }
    });
  }

  save() {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: true
    });
    dialogRef.componentInstance.mensajeConfirmacion = `Se modificará la categoría seleccionada. ¿Desea continuar?`;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.updateCategoria(this.selectedCat).subscribe(res => {
          this.snackBar.open(res.message, '', {
            duration: 1000
          });
          this.obtenerCategorias();
        }, error => {
          this.snackBar.open(error.error, '', {
            duration: 1000
          });
        });
      }
    });
  }

  cancel() {
    this.newCat = null;
    this.autoSelect();
  }

  create() {
    this.newCat = null;
    this.api.createCategoria(this.selectedCat).subscribe(result => {
      if (result.status === 'success') {
        this.snackBar.open(result.message, '', {
          duration: 1500,
        });
        this.obtenerCategorias();
      }
    }, error => {
      this.snackBar.open(error.error, '', {
        duration: 1500,
      });
    });
  }

  select(categoria: Categoria) {
    this.selectedCat = Object.assign({}, categoria);
    this.newCat = null;
  }

  autoSelect() {
    if (this.categorias.length !== 0) {
      this.selectedCat = Object.assign({}, this.categorias[0]);
    }
  }



}
