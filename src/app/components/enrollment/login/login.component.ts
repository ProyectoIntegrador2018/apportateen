import { Component, OnInit, Inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ApiService } from 'app/services/api/api.service';
import { Router } from '@angular/router';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { NgxPermissionsService } from 'ngx-permissions';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    email: string;
    password: string;
    hide = true;
    loading: boolean;

    constructor(private firebaseAuth: AngularFireAuth,
        private api: ApiService,
        public router: Router,
        @Inject(LOCAL_STORAGE) private storage: WebStorageService,
        private permissionsService: NgxPermissionsService,
        public snackBar: MatSnackBar) {
        this.loading = false;
    }

    ngOnInit() {
    }

    login() {
        this.loading = true;
        this.firebaseAuth.auth.signInWithEmailAndPassword(this.email, this.password).
            then(value => {
                this.api.getUserById(value.user.uid).subscribe(result => {
                    this.storage.set('@user:data', result);
                    let perm = [];
                    if (result.isAdmin) {
                        perm = ["ADMIN"];
                        this.router.navigate(['admin']);
                    } else {
                        perm = ["USER"];
                        this.router.navigate(['usuario']);
                    }
                    this.loading = false;
                    this.permissionsService.loadPermissions(perm);
                })
            }).catch(err => {
                this.loading = false;
                this.snackBar.open('El usuario o la contraseña pueden ser incorrectos.', '', {
                    duration: 1850,
                });
            })
    }

}