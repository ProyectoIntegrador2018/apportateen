import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { log } from 'util';
import { ApiService } from '../../services/api/api.service';
import { Sponsor } from '../../models/sponsor.model';

@Component({
    selector: 'hpme-patrocinadores',
    templateUrl: './home-patrocinadores.component.html',
    styleUrls: ['./home-patrocinadores.component.scss']
})

export class HomePatrocinadoresComponent {
    nombre: string;
    email: string;
    isVisible = false;
    sponsorList
    sponsor: Sponsor = new Sponsor();

    constructor(public snackBar: MatSnackBar, private api: ApiService) {
        this.isVisible = false;
        this.sponsorList = [
          {
            frase: "Frase de la UDEM",
            url: '../../../../assets/img/sponsors/udem.png',
            backImg: '../../../../assets/img/main4.jpg'
          },
          {
            frase: "Frase del Tec",
            url: '../../../../assets/img/sponsors/itesm.png',
            backImg: '../../../../assets/img/main4.jpg'
          },
          {
            frase: "Frase de la UANL",
            url: '../../../../assets/img/sponsors/uanl.png',
            backImg: '../../../../assets/img/main4.jpg'
          },
          {
            frase: "Frase de la UERRE",
            url: '../../../../assets/img/sponsors/uerre.png',
            backImg: '../../../../assets/img/main4.jpg'
          },
          {
            frase: "Frase de Nuvasoft",
            url: '../../../../assets/img/sponsors/nuvasoft.png',
            backImg: '../../../../assets/img/main4.jpg'
          },
          {
            frase: "Frase de Sofftek",
            url: '../../../../assets/img/sponsors/sofftek.png',
            backImg: '../../../../assets/img/main4.jpg'
          },
          {
            frase: "Frase de NIC",
            url: '../../../../assets/img/sponsors/nic.png',
            backImg: '../../../../assets/img/main4.jpg'
          },
          {
            frase: "Frase de Tecnoap",
            url: '../../../../assets/img/sponsors/tecnoap.jpeg',
            backImg: '../../../../assets/img/main4.jpg'
          }
        ]
    }

    toggleTable() {
        this.isVisible = !this.isVisible;
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
