import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainUserComponent } from './main-user/main-user.component'
import { FormsModule } from '@angular/forms';

import { MatSidenavModule, MatIconModule, MatToolbarModule, MatListModule, MatButtonToggleModule, MatCardModule, MatInkBar, MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule, MatDialogModule, MatSnackBarModule, MatTooltipModule, MatMenuModule } from '@angular/material';
import { InscripcionComponent } from './inscripcion/inscripcion.component';
import { AvisosUserComponent } from './avisos/avisos.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AvisoInscripcionTallerComponent } from './avisos/aviso-inscripcion-taller/aviso-inscripcion-taller.component';
import { DocumentosUsuarioComponent } from './documentos-usuario/documentos-usuario.component';
import { DetalleTallerComponent } from './detalle-taller/detalle-taller.component';
import { AvisoInscripcionComponent } from './detalle-taller/aviso-inscripcion/aviso-inscripcion.component';



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
    MatTooltipModule,
    MatMenuModule

  ],
  declarations: [MainUserComponent, InscripcionComponent, AvisosUserComponent, AvisoInscripcionTallerComponent, DocumentosUsuarioComponent, DetalleTallerComponent, AvisoInscripcionComponent],
  exports: [MainUserComponent],
})
export class UserModule { }
