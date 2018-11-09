import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { log } from 'util';

@Component({
    selector: 'inicio',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent { 
    nombre: string;
    email: string;

    constructor(public snackBar: MatSnackBar) {
        this.nombre = "";
        this.email = "";
    }

    validateEmail(e) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(e).toLowerCase());
    }

    validate(): boolean {
        if (this.nombre.trim().length == 0 || this.email.trim().length == 0 || !this.validateEmail(this.email)) {
            return false;
        }
        return true;
    }
    register(){
        if(this.validate()){
            console.log("registra");
            
        } else{
            console.log("no registra");
            this.snackBar.open('Revise que ambos campos estén correctos', '', {
                duration: 2000,
            });
        }

    }
}