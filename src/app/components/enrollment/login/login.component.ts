import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    email: string;
    password: string;
    hide = true;

    constructor(private firebaseAuth: AngularFireAuth) { 
        this.email="";
        this.password="";
    }

    ngOnInit() {
    }

    validate(){
        if(this.email.trim().length== 0 || this.password.trim().length== 0){
            console.log("Aun hay campos incorrectos");  
        }
        else{
            this.login();
        }
    }

    login() {
        this.firebaseAuth.auth.signInWithEmailAndPassword(this.email, this.password).
            then(value => {
                console.log(value);
            }).catch(err => {
                console.log('imposible iniciar sesión')
            })
    }

}