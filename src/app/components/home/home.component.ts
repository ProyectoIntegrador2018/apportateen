import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { log } from 'util';
import { ApiService } from '../../services/api/api.service';
import { Sponsor } from '../../models/sponsor.model';

@Component({
    selector: 'inicio',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent {
    nombre: string;
    email: string;
    first: boolean;
    second: boolean;
    third: boolean;
    status: boolean;
    rstatus: boolean;
    sponsor: Sponsor = new Sponsor();

    constructor(public snackBar: MatSnackBar, private api: ApiService) {
        this.first = true;
        this.second = false;
        this.third = false;
    }

    clickFirstSlide(){
        this.first = true;
        this.second = false;
        this.third = false;
    }

    clickSecondSlide(){
        this.first = false;
        this.second = true;
        this.third = false;
    }

    clickThirdSlide(){
        this.first = false;
        this.second = false;
        this.third = true;
    }

    next(){
        if(this.first){
            this.first = false;
            this.second = true;
            this.third = false;
        } else if(this.second){
            this.first = false;
            this.second = false;
            this.third = true;
        } else if (this.third){
            this.first = true;
            this.second = false;
            this.third = false;
        }
        
    }

    prev(){
        if(this.first){
            this.first = false;
            this.second = false;
            this.third = true;
            
        } else if(this.second){
            this.first = true;
            this.second = false;
            this.third = false;
        } else if(this.third){
            this.first = false;
            this.second = true;
            this.third = false;
        }
    }

    validateEmail(e) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(e).toLowerCase());
    }

    validate(): boolean {
        if (this.sponsor.nombre.trim().length == 0 || this.sponsor.correo.trim().length == 0 || !this.validateEmail(this.sponsor.correo)) {
            return false;
        }
        return true;
    }
    register() {
        if (this.validate()) {
            this.api.createSponsor(this.sponsor).subscribe(res => {
                this.snackBar.open(res.message, '', {
                    duration: 1400,
                });
            }, error => {
                this.snackBar.open(error.error, '', {
                    duration: 1400,
                });
            })
        } else {
            this.snackBar.open('Revise que ambos campos estén correctos', '', {
                duration: 1400,
            });
        }

    }
}
