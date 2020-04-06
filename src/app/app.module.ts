import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material';

import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/home/home.component';
import { AppRoutingModule } from './components/app/app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UiModule } from './components/ui/ui.module';
import { EnrollmentModule } from './components/enrollment/enrollment.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { ApiService } from './services/api/api.service';
import { AdminModule } from './components/admin/admin.module';
import { MAT_DATE_LOCALE, MatButtonModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';
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
import { PruebaComponent } from './components/prueba/prueba.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ConfirmationDialog,
    AddDialog,
    PruebaComponent
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
    MatDialogModule,
    MatListModule,
    MatInputModule,
    MatStepperModule,
    MatSelectModule,
    NgxPageScrollModule,
    AngularFireStorageModule
  ],
  providers: [ApiService, {
    provide: MAT_DATE_LOCALE, useValue: 'es-MX'
  }, ExcelService],
  bootstrap: [AppComponent],
  entryComponents: [AddDialog, ConfirmationDialog, UsuariosDetalleComponent, AvisoInscripcionTallerComponent]
})
export class AppModule { }
