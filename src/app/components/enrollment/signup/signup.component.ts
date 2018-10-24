import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ApiService } from '../../../services/api/api.service';
import { User } from '../../../models/user.model';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';


export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

@Component({
    selector: 'signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})

export class SignupComponent {
    password: string;
    passwordConf: string;
    fecha_nacimiento: string;
    usuario: User = new User();
    hide = true;
    hideConf = true;
    emailFormControl = new FormControl('', [
        Validators.required,
        Validators.email,
    ]);

    matcher = new MyErrorStateMatcher();
    constructor(private firebaseAuth: AngularFireAuth, private api: ApiService) { 
        this.password ="";
        this.passwordConf="";
    }

    dateReg = /^\d{2}([./-])\d{2}\1\d{4}$/

    validate():boolean {
        
        //todo: give user feedback when passwords don't match
        if (this.usuario.correo.trim().length== 0 || this.usuario.nombre.trim().length== 0 || this.usuario.apellido.trim().length== 0 || this.password.trim().length== 0 || this.passwordConf.trim().length== 0 || !this.usuario.fecha_nacimiento.match(this.dateReg) || this.usuario.fecha_nacimiento=="31-12-1969" || this.password != this.passwordConf || this.password.length < 6){
            console.log("Aun hay campos incorrectos");  
            return false;
        }
        else{
            return true;
        }
        
    }

    signup() {

        this.usuario.fecha_nacimiento = this.formatDate(this.fecha_nacimiento);
        console.log(this.usuario);
        //missing field validation        
        this.firebaseAuth.auth.createUserWithEmailAndPassword(this.usuario.correo, this.password).
            then(user => {
                this.usuario.id = user.user.uid;
                this.api.createUser(this.usuario).subscribe(result => console.log(result));
            })
            .catch(error => {
                console.log(error.message);
            })
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('-');
    }
}