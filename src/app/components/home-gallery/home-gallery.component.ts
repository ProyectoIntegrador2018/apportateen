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
        this.gallery = ['../../../assets/img/main.jpg', '../../../assets/img/main2.jpg', '../../../assets/img/main3.jpg', '../../../assets/img/main4.jpg', '../../../assets/img/main5.JPG'
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
