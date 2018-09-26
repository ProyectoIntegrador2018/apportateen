import { Component, OnInit } from '@angular/core';
import { Sede } from '../../../models/sede.model';

@Component({
    selector: 'sedes',
    templateUrl: './sedes.component.html',
    styleUrls: ['./sedes.component.scss']
})

export class SedesComponent implements OnInit {

  newSede: Sede;
  selectedSede: Sede;

  constructor() { }

  ngOnInit() {
      this.selectedSede = new Sede();
      this.selectedSede.nombre = "Sede 1";
      this.selectedSede.descripcion = "descripcion sede 1"
  }

  add() {
      this.newSede = new Sede();
      this.selectedSede = this.newSede;
  }

  delete(){

  }

  save(){

  }

  cancel() {
    this.newSede = null;
  }

  create(){

  }



}
