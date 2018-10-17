import { Component, OnInit } from '@angular/core';
import { Sede } from '../../../models/sede.model';
import { ApiService } from '../../../services/api/api.service';

@Component({
  selector: 'categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})

export class CategoriasComponent implements OnInit {

  newSede: Sede;
  selectedSede;
  sedes;

  constructor(private api: ApiService) {
    this.sedes = [];
    this.selectedSede = {};
  }

  ngOnInit() {
    this.api.getAllSedes().subscribe(result => {
      this.sedes = result;
      console.log(this.sedes);
      this.autoSelect();
    });
  }

  add() {
    this.newSede = new Sede();
    this.selectedSede = this.newSede;
  }

  delete() {
    let index = this.sedes.indexOf(this.selectedSede);
    this.sedes.splice(index, 1);
    this.api.removeSede(this.selectedSede.id).subscribe(result => console.log(result));
    this.autoSelect();
  }

  save() {
    this.api.updateSede(this.selectedSede).subscribe(result => console.log(result));
  }

  cancel() {
    this.newSede = null;
    this.autoSelect();
  }

  create() {
    this.sedes.push(this.selectedSede);
    this.newSede = null;
    this.api.createSede(this.selectedSede).subscribe(result => console.log(result));
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
