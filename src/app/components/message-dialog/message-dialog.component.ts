// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-message-dialog',
//   templateUrl: './message-dialog.component.html',
//   styleUrls: ['./message-dialog.component.scss']
// })
// export class MessageDialogComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }

import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-message-dialog',
    template: `<h1 mat-dialog-title>{{titulo}}</h1>
    <div mat-dialog-content>
      <p>{{mensaje}}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="dialogRef.close(true)" color="primary" cdkFocusInitial>Aceptar</button>
    </div>`
})
export class MessageDialogComponent  {
    public mensaje: string;
    public titulo: string;
    constructor(
        public dialogRef: MatDialogRef<MessageDialogComponent>) { }
}
