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
  sedes: Array<Sede> = [];

  constructor() { }

  ngOnInit() {
    let sede1 = new Sede();
    sede1.sede_id = "1";
    sede1.nombre = "Sede 1";
    sede1.descripcion = "Descripcion sede 1";
    let sede2 = new Sede();
    sede2.sede_id = "2";
    sede2.nombre = "Sede 2";
    sede2.descripcion = "Descripcion sede 2";
    let sede3 = new Sede();
    sede3.sede_id = "3";
    sede3.nombre = "Sede 3";
    sede3.descripcion = "Descripcion sede 3";

    this.sedes.push(sede1);
    this.sedes.push(sede2);
    this.sedes.push(sede3);
    this.selectedSede = sede1;

    this.autoSelect();
  }

  add() {
    this.newSede = new Sede();
    this.selectedSede = this.newSede;
  }

  delete() {
    let index = this.sedes.indexOf(this.selectedSede);
    this.sedes.splice(index, 1);
    this.autoSelect();
  }

  save() {
    // WS
  }

  cancel() {
    this.newSede = null;
    this.autoSelect();
  }

  create() {
    // WS
    // if success
    this.sedes.push(this.selectedSede);
    this.newSede = null;
  }

  select(sede: Sede) {
    this.selectedSede = sede;
  }

  autoSelect() {
    if (this.sedes.length != 0) {
      this.selectedSede = this.sedes[0];
    }
  }



}
