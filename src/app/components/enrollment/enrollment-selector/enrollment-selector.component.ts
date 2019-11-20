import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WebStorageService, LOCAL_STORAGE } from 'angular-webstorage-service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
    selector: 'enrollment',
    templateUrl: './enrollment-selector.component.html',
    styleUrls: ['./enrollment-selector.component.scss']
})

export class EnrollmentComponent {
    isLoginSelected: boolean = true;
    loggedIn: boolean = null;
    constructor(public router: Router,
        @Inject(LOCAL_STORAGE) private storage: WebStorageService,
        afAuth: AngularFireAuth) {

        let user = this.storage.get('@user:data');
        afAuth.authState.subscribe(auth => {
            if (auth) {
                if (user && auth) {
                    this.loggedIn = true;
                    if (user.isAdmin) {
                        this.router.navigate(['admin']);
                    } else {
                        this.router.navigate(['usuario']);
                    }
                } else {
                    this.loggedIn = false;
                }
            }
        });
    }
}