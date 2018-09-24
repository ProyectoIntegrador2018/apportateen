import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ApportaTeen';

  constructor(afAuth: AngularFireAuth) {
    afAuth.authState.subscribe(auth => {
      if (auth) {
        console.log('logged in');
      } else {
        console.log('not logged in');
      }
    });
  }
}
