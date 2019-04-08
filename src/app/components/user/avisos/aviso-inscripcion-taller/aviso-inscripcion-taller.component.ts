import { Component, OnInit, } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import { Aviso } from 'app/models/aviso.model';

@Component({
  selector: 'app-aviso-inscripcion-taller',
  templateUrl: './aviso-inscripcion-taller.component.html',
  styleUrls: ['./aviso-inscripcion-taller.component.scss']
})
export class AvisoInscripcionTallerComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AvisoInscripcionTallerComponent>) { }

  ngOnInit() {
  }

}
