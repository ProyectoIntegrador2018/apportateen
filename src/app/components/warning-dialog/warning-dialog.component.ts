import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'warning-dialog',
  template: `
    <h1 mat-dialog-title>Error</h1>
    <div mat-dialog-content>
      <p>No es posible inscribir este taller por cuestiones de fecha, hora o ciudad con respecto a algún taller que ya tienes inscrito</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="dialogRef.close(false)">Ok</button>
    </div>
  `
  
})
export class WarningDialogComponent{

  constructor(public dialogRef: MatDialogRef<WarningDialogComponent>) { }
}