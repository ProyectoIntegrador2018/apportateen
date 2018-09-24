// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBns31xrzExqUbCC6nHOOjVswr6dq9vdY4',
    authDomain: 'apportateen.firebaseapp.com',
    databaseURL: 'https://apportateen.firebaseio.com',
    projectId: 'apportateen',
    storageBucket: 'apportateen.appspot.com',
    messagingSenderId: '558841100052'
  },
  apiUrl: 'http://localhost:3000'
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
