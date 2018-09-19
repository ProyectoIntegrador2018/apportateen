import { Component } from '@angular/core';

@Component({
    selector: 'enrollment',
    templateUrl: './enrollment-selector.component.html',
    styleUrls: ['./enrollment-selector.component.scss']
})

export class EnrollmentComponent {
    isLoginSelected: boolean = false;
}