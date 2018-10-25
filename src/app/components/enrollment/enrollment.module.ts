import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EnrollmentComponent } from './enrollment-selector/enrollment-selector.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ApiService } from '../../services/api/api.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule, MatButtonModule } from '@angular/material';
import { StorageServiceModule } from 'angular-webstorage-service';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        HttpClientModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        MatIconModule,
        StorageServiceModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatButtonModule
    ],
    providers: [ApiService],
    declarations: [EnrollmentComponent, LoginComponent, SignupComponent],
    exports: [EnrollmentComponent, NgxPermissionsModule]
})
export class EnrollmentModule { }