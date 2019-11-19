import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  mensaje: string;
  num_de_conf: string;
}

@Component({
    selector: 'add-dialog',
    template: `<h1 mat-dialog-title>Agregar</h1>
    <div mat-dialog-content>
      <p>{{data.mensaje}}</p>
      <mat-form-field>
        <input matInput [(ngModel)]="data.num_de_conf">
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()" color="warn">Cancelar</button>
      <button mat-button [mat-dialog-close]="data.num_de_conf" color="primary" cdkFocusInitial>Confirmar</button>
    </div>`
})
export class AddDialog {
    constructor(
        public dialogRef: MatDialogRef<AddDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    onNoClick(): void {
      this.dialogRef.close();
    }
}
