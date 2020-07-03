import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { log } from 'util';
import { ApiService } from '../../services/api/api.service';


@Component({
    selector: 'home-talleres',
    templateUrl: './home-talleres.component.html',
    styleUrls: ['./home-talleres.component.scss']
})

export class HomeTalleresComponent {
    talleres;

    constructor(public snackBar: MatSnackBar, private api: ApiService) {
        this.talleres = [];
    }

    ngOnInit() {
        this.obtenerTalleres();
      }
      obtenerTalleres() {
        this.api.getAllTalleres().subscribe(result => {
          this.talleres = result[0];
          console.log("talleres:")
          console.log(this.talleres)
        })
      }
      formatDates(inicial, final){
          inicial = new Date(inicial);
          final = new Date(final)
          let months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
          let iniMonth = inicial.getMonth();
          let finMonth = final.getMonth();
          let iniDay = inicial.getDate() + 1;
          let finDay = final.getDate() + 1;
          if(iniMonth == finMonth){
              return `${iniDay} - ${finDay} de ${months[iniMonth]}`
          }
          return `${iniDay} de ${months[iniMonth]} al ${finDay} de ${months[finMonth]} `
      }
}
