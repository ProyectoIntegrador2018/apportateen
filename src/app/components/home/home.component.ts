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
    faqstatus: boolean;
    isVisible = false;
    sponsorList;
    sponsor: Sponsor = new Sponsor();

    constructor(public snackBar: MatSnackBar, private api: ApiService) {
        this.first = true;
        this.second = false;
        this.third = false;
        this.isVisible = false;
        this.sponsorList = [
            {
              frase: "Frase de la UDEM",
              url: '../../../../assets/img/sponsors/udem.png',
              backImg: '../../../../assets/img/main4.jpeg'
            },
            {
              frase: "Frase del Tec",
              url: '../../../../assets/img/sponsors/itesm.png',
              backImg: '../../../../assets/img/main4.jpeg'
            },
            {
              frase: "Frase de la UANL",
              url: '../../../../assets/img/sponsors/uanl.png',
              backImg: '../../../../assets/img/main4.jpeg'
            },
            {
              frase: "Frase de la UERRE",
              url: '../../../../assets/img/sponsors/uerre.png',
              backImg: '../../../../assets/img/main4.jpeg'
            },
            {
              frase: "Frase de Sofftek",
              url: '../../../../assets/img/sponsors/sofftek.png',
              backImg: '../../../../assets/img/main4.jpeg'
            },
            {
              frase: "Frase de Tecnoap",
              url: '../../../../assets/img/sponsors/tecnoap.jpeg',
              backImg: '../../../../assets/img/main4.jpeg'
            }, 
            {
                frase: "Frase de Accenture",
                url: '../../../../assets/img/sponsors/logo_accenture.png',
                backImg: '../../../../assets/img/main4.jpeg'
            }
          ]
    }

    toggleTable() {
        this.isVisible = !this.isVisible;
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
                    duration: 5000,
                });
            }, error => {
                this.snackBar.open(error.error, '', {
                    duration: 5000,
                });
            })
        } else {
            this.snackBar.open('Revise que ambos campos estén correctos', '', {
                duration: 5000,
            });
        }

    }
}
