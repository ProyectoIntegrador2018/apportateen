import { Component, Inject } from '@angular/core';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { log } from 'util';
import { ApiService } from '../../services/api/api.service';


@Component({
    selector: 'home-gallery',
    templateUrl: './home-gallery.component.html',
    styleUrls: ['./home-gallery.component.scss']
})

export class HomeGalleryComponent {
    gallery;

    constructor(public snackBar: MatSnackBar, private api: ApiService, public dialog: MatDialog) {
        this.gallery = [
        '../../../assets/img/main.jpg',
         '../../../assets/img/main2.jpeg',
          '../../../assets/img/main3.jpg',
           '../../../assets/img/main4.jpeg',
            '../../../assets/img/main5.JPG',
            '../../../assets/img/main6.jpeg',
            '../../../assets/img/main7.jpg',
            '../../../assets/img/main8.jpeg',
            '../../../assets/img/main9.jpeg',

            '../../../assets/img/gallery/galeria1.JPG',
            '../../../assets/img/gallery/galeria2.JPG',
            '../../../assets/img/gallery/galeria3.JPG',
            '../../../assets/img/gallery/galeria4.JPG',
            '../../../assets/img/gallery/galeria5.JPG',
            '../../../assets/img/gallery/galeria6.JPG',
            '../../../assets/img/gallery/galeria7.JPG',
            '../../../assets/img/gallery/galeria8.JPG',
            '../../../assets/img/gallery/galeria9.jpg',
            '../../../assets/img/gallery/galeria10.jpg',
            '../../../assets/img/gallery/galeria11.jpg',
            '../../../assets/img/gallery/galeria12.jpg',
            '../../../assets/img/gallery/galeria13.jpg',
            '../../../assets/img/gallery/galeria14.jpg',
            '../../../assets/img/gallery/galeria15.jpg',
            '../../../assets/img/gallery/galeria16.jpg',
            '../../../assets/img/gallery/galeria17.jpg',
            '../../../assets/img/gallery/galeria18.jpg',
            '../../../assets/img/gallery/galeria19.jpg',
            '../../../assets/img/gallery/galeria20.jpg',
            '../../../assets/img/gallery/galeria21.jpg',
            '../../../assets/img/gallery/galeria22.jpg',
            '../../../assets/img/gallery/galeria23.jpeg',
            '../../../assets/img/gallery/galeria24.jpeg'
      ];
    }

    showDialog(img){
        console.log(img);
    }
    openDialog(img): void {
        const dialogRef = this.dialog.open(GalleryDialog, {
          data: {imgs: img}
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
      }
}

export interface DialogData {
    imgs: string;
  }
  
  @Component({
      selector: 'gallery-dialog',
      template: `
      <div style="text-align:center;"><img style="width:95%;" class="gallery-dialog-image" [src]="data.imgs" alt="Patrocinador"></div>`
  })
  export class GalleryDialog {
      constructor(
          public dialogRef: MatDialogRef<GalleryDialog>,
          @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
  
      onNoClick(): void {
        this.dialogRef.close();
      }
  }
