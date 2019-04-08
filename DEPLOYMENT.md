## DEPLOYMENT - APPORTATEEN
#### 1. ANGULAR
- To deploy the project in angular, we need to run the following instruction in the project's terminal: `ng build --prod`
After deploying angular's project, we need to deploy the *Firebase* project.

#### 2. FIREBASE
- To deploy the project in firebase, the user that is going to deploy the project needs to have access to the firebase project's console, if he doesn't have access then it wouldn't let him deploy it.

The steps that we need to follow in the project's terminal are the following:
1. Run `firebase login`. This will ask us for our user that has the valids credentials in firebase.
2. Run `firebase deploy`

After this steps, and a success deploy, that project should now be available in production.
