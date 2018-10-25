import { Component, ChangeDetectorRef, OnDestroy, Inject } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
    selector: 'admin',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnDestroy {
    mobileQuery: MediaQueryList;

    private _mobileQueryListener: () => void;

    constructor(changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,
        private fireAuth: AngularFireAuth,
        public router: Router,
        @Inject(LOCAL_STORAGE) private storage: WebStorageService,
        private permissionsService: NgxPermissionsService) {
        this.mobileQuery = media.matchMedia('(max-width: 576px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    logout() {
        this.fireAuth.auth.signOut().then(() => {
            this.storage.remove('@user:data');
            this.permissionsService.flushPermissions();
            this.router.navigate(['ingresar']);
        })
    }
}