import { Component, OnInit, Inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ApportaTeen';

  constructor(private afAuth: AngularFireAuth, public router: Router,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    private permissionsService: NgxPermissionsService) {
    afAuth.authState.subscribe(auth => {
      if (auth) {
      } else {
      }
    });
  }

  ngOnInit() {
    let perm = [];
    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        let user = this.storage.get('@user:data');
        if (user) {
          perm = user.isAdmin ? ["ADMIN"] : ["USER"];
          this.permissionsService.loadPermissions(perm);
        }
      }
    })
  }
}
