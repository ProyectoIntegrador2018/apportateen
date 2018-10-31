import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'confirm-dialog',
    template: `<h1 mat-dialog-title>Confirmación</h1>
    <div mat-dialog-content>
      <p>{{mensajeConfirmacion}}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="dialogRef.close(false)" color="primary">No, cancelar</button>
      <button mat-button (click)="dialogRef.close(true)" color="warn" cdkFocusInitial>Sí, continuar</button>
    </div>`
})
export class ConfirmationDialog {
    public mensajeConfirmacion: string;
    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialog>) { }
}