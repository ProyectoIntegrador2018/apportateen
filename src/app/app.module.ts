import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material';

import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/home/home.component';
import { HomeTalleresComponent } from './components/home-talleres/home-talleres.component';
import { HomeFAQComponent } from './components/home-faq/home-faq.component';
import { HomeExitoComponent } from './components/home-exito/home-exito.component';
import { HomePatrocinadoresComponent } from './components/home-patrocinadores/home-patrocinadores.component';
import { HomeGalleryComponent } from './components/home-gallery/home-gallery.component';
import { AppRoutingModule } from './components/app/app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UiModule } from './components/ui/ui.module';
import { EnrollmentModule } from './components/enrollment/enrollment.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { ApiService } from './services/api/api.service';
import { AdminModule } from './components/admin/admin.module';
import { MAT_DATE_LOCALE, MatButtonModule, MatIconModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import { UserModule } from './components/user/user.module';
import { MatListModule } from '@angular/material/list';
import { NgxPermissionsModule } from 'ngx-permissions';
import 'hammerjs';
import { ConfirmationDialog } from './components/confirmation-dialog/confirmation-dialog.component';
import { AddDialog } from './components/add-dialog/add-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { ExcelService } from './services/excel.service';
import { UsuariosDetalleComponent } from './components/admin/usuarios/usuarios-detalle/usuarios-detalle.component';
import { Aviso } from './models/aviso.model';
import { AvisoInscripcionTallerComponent } from './components/user/avisos/aviso-inscripcion-taller/aviso-inscripcion-taller.component';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/storage';
import { MessageDialogComponent } from './components/message-dialog/message-dialog.component';
import { WarningDialogComponent } from './components/warning-dialog/warning-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HomeTalleresComponent,
    HomeFAQComponent,
    HomeExitoComponent,
    HomePatrocinadoresComponent,
    HomeGalleryComponent,
    ConfirmationDialog,
    AddDialog,
    MessageDialogComponent,
    WarningDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxPermissionsModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    FormsModule,
    BrowserAnimationsModule,
    UiModule,
    EnrollmentModule,
    AdminModule,
    UserModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatDialogModule,
    MatListModule,
    MatInputModule,
    MatStepperModule,
    MatSelectModule,
    NgxPageScrollModule,
    AngularFireStorageModule,
    MatIconModule,
  ],
  providers: [ApiService, {
    provide: MAT_DATE_LOCALE, useValue: 'es-MX'
  }, ExcelService],
  bootstrap: [AppComponent],
  entryComponents: [AddDialog, ConfirmationDialog, UsuariosDetalleComponent, AvisoInscripcionTallerComponent, WarningDialogComponent, MessageDialogComponent]
})
export class AppModule { }
