import { Component, OnInit, Inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { NgxPermissionsService } from 'ngx-permissions';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    isCollapsed = false;
    user: boolean;
    constructor(private afAuth: AngularFireAuth,
        @Inject(LOCAL_STORAGE) private storage: WebStorageService,
        private permissionsService: NgxPermissionsService,
        public router: Router) {
        this.user = false;
    }

    ngOnInit() {
        this.afAuth.authState.subscribe(auth => {
            this.user = auth ? true : false;
        });
    }

    logout() {
        this.afAuth.auth.signOut().then(() => {
            this.storage.remove('@user:data');
            this.permissionsService.flushPermissions();
        });
    }

    userRedirect() {
        const stUser = this.storage.get('@user:data');
        if (stUser.isAdmin) {
            this.router.navigate(['admin']);
        } else {
            this.router.navigate(['usuario']);
        }
    }

}
