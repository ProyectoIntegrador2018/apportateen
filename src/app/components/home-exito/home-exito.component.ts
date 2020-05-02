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
          nombre:'Lizzie Hernández',
          subtitulo:'Generación 2015',
          testimonio:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis velit erat. Donec aliquam nibh quis rutrum auctor. Nullam ac facilisis lacus. Vivamus hendrerit, urna mollis faucibus maximus, lorem justo venenatis erat, ut efficitur sapien arcu vitae felis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis nec eros consectetur, pharetra urna id, semper elit.',
          urlImg: '../../../assets/img/historiaExito.PNG'
        },
        {
          nombre:'Ana María López',
          subtitulo:'Generación 2017',
          testimonio:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis velit erat. Donec aliquam nibh quis rutrum auctor. Nullam ac facilisis lacus. Vivamus hendrerit, urna mollis faucibus maximus, lorem justo venenatis erat, ut efficitur sapien arcu vitae felis.',
          urlImg: '../../../assets/img/historiaExito.PNG'
        }
      ];
    }

    
}
