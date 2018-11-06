import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainUserComponent } from './main-user/main-user.component'
import { FormsModule } from '@angular/forms';

import { MatSidenavModule, MatIconModule, MatToolbarModule, MatListModule, MatButtonToggleModule, MatCardModule, MatInkBar, MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule, MatDialogModule, MatSnackBarModule, MatTooltipModule } from '@angular/material';
import { InscripcionComponent } from './inscripcion/inscripcion.component';
import { AvisosUserComponent } from './avisos/avisos.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    RouterModule,
    FormsModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatButtonToggleModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  declarations: [MainUserComponent, InscripcionComponent, AvisosUserComponent],
  exports: [MainUserComponent],
})
export class UserModule { }
