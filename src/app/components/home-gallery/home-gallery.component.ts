import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { log } from 'util';
import { ApiService } from '../../services/api/api.service';


@Component({
    selector: 'home-gallery',
    templateUrl: './home-gallery.component.html',
    styleUrls: ['./home-gallery.component.scss']
})

export class HomeGalleryComponent {
    gallery;

    constructor(public snackBar: MatSnackBar, private api: ApiService) {
        this.gallery = ['../../../assets/img/main.jpg', '../../../assets/img/main2.jpg', '../../../assets/img/main3.jpg', '../../../assets/img/main4.jpg', '../../../assets/img/main5.JPG'
      ];
    }

    
}
