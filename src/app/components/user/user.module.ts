import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainUserComponent } from './main-user/main-user.component'
import { FormsModule } from '@angular/forms';

import { MatSidenavModule, MatIconModule, MatToolbarModule, MatListModule } from '@angular/material';
import { InscripcionComponent } from './inscripcion/inscripcion.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule
  ],
  declarations: [MainUserComponent, InscripcionComponent],
    exports: [MainUserComponent]
})
export class UserModule { }
