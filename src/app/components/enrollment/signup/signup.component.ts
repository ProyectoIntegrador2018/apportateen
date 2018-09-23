import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ApiService } from '../../../services/api/api.service';
import { User } from '../../../models/user.model';

@Component({
    selector: 'signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})

export class SignupComponent {
    nombre: string;
    correo: string;
    password: string;
    passwordConf: string;
    fecha_nacimiento: string;
    usuario: User = new User();
    constructor(private firebaseAuth: AngularFireAuth, private api: ApiService) { }

    signup() {
        //missing field validation
        this.usuario.nombre = this.nombre;
        this.usuario.correo = this.correo;
        this.usuario.fecha_nacimiento = '01-05-1996';
        this.firebaseAuth.auth.createUserWithEmailAndPassword(this.correo, this.password).
            then(user => {
                this.usuario.user_id = user.user.uid;
                this.api.createUser(this.usuario).subscribe(result => console.log(result));
            })
    }
}