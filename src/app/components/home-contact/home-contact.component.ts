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
          contacto:'Contacto general: capitalhumano@csoftmty.org'
        }]
    }
}