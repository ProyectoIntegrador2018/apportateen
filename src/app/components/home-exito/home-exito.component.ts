import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { log } from 'util';
import { ApiService } from '../../services/api/api.service';


@Component({
    selector: 'home-exito',
    templateUrl: './home-exito.component.html',
    styleUrls: ['./home-exito.component.scss']
})

export class HomeExitoComponent {
    testimonios;

    constructor(public snackBar: MatSnackBar, private api: ApiService) {
        this.testimonios = [{
          nombre:'Carlos Aquino Colín',
          subtitulo:'Edad: 11 años, estudiante de primero de secundaria',
          testimonio:'Inició desde los 9 años y ha aprendido diseño de apps básicas y avanzadas, curso de drones, impresión y diseño en 3D, programación competitiva y robótica. Piensa que todos ellos le servirán mucho en su formación profesional de universidad y en su carrera.',
          // urlImg: '../../../assets/img/h-exito/historiaExito.PNG'
        },
        {
          nombre:'César Ricardo Garza',
          subtitulo:'Edad: 13 años',
          testimonio:'¡¡Es increíble como así de fácil aprendimos a hacer apps en Android!!',
          // urlImg: '../../../assets/img/h-exito/historiaExito.PNG'
        },
        {
          nombre:'Eugenio Treviño, Jorge Salvans, Jesús Garza y Ángel Salvans',
          subtitulo:'Integrantes del equipo ABC aprende',
          testimonio:'Participantes del taller App Inventor de Axt@teen 2019 y creadores de una app educativa que participó en la Feria de Ciencia y Tecnología 2019.',
          urlImg: '../../../assets/img/h-exito/he-3.jpg'
        },
      ];
    }

    
}
