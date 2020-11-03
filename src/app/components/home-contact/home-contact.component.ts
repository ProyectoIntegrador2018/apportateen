import { Component, Inject } from '@angular/core';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { log } from 'util';
import { ApiService } from '../../services/api/api.service';


@Component({
    selector: 'home-contact',
    templateUrl: './home-contact.component.html',
    styleUrls: ['./home-contact.component.scss']
})

export class HomeContactComponent {
    contact;

    constructor(public snackBar: MatSnackBar, private api: ApiService) {
        this.contact = [{
          correo:'Contacto general: capitalhumano@csoftmty.org', 
          facebook: 'Página de Facebook: https://www.facebook.com/search/top?q=apportateen', 
          telefono: '+52 8183433128', 
          direccion: 'CSOFTMTY. Miguel Hidalgo PTE, Piso 38, SUITE/OFICINA 38-115. Monterrey Nuevo León. CP. 64060'
        }]
    }
}