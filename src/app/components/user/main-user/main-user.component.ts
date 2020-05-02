import { Component, Inject, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { NgxPermissionsService } from 'ngx-permissions';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from 'app/models/user.model';

@Component({
  selector: 'user',
  templateUrl: './main-user.component.html',
  styleUrls: ['./main-user.component.scss']
})

export class MainUserComponent implements OnDestroy, OnInit {
  mobileQuery: MediaQueryList;
  user: User = new User();

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    private fireAuth: AngularFireAuth,
    public router: Router,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    private permissionsService: NgxPermissionsService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit(): void {
    this.user = this.storage.get('@user:data');
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