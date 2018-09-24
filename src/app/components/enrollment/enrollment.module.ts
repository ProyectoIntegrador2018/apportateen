import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnrollmentComponent } from './enrollment-selector/enrollment-selector.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ApiService } from '../../services/api/api.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        HttpClientModule
    ],
    providers: [ApiService],
    declarations: [EnrollmentComponent, LoginComponent, SignupComponent],
    exports: [EnrollmentComponent]
})
export class EnrollmentModule { }