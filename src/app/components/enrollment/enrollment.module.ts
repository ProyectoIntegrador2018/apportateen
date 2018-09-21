import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentComponent } from './enrollment-selector/enrollment-selector.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [EnrollmentComponent, LoginComponent, SignupComponent],
    exports: [EnrollmentComponent]
})
export class EnrollmentModule { }