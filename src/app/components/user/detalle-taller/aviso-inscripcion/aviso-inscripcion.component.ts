import { Component, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-aviso-inscripcion',
  templateUrl: './aviso-inscripcion.component.html',
  styleUrls: ['./aviso-inscripcion.component.scss']
})


export class AvisoInscripcionComponent implements OnInit {

  constructor() {
    // dialogRef.disableClose = true;
  }

  ngOnInit() {
  }

  // noClick(): void {
  //   this.dialogRef.close();
  // }

}
