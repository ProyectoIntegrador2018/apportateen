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
            frase: "",
            url: '../../../../assets/img/sponsors/udem.png',
            backImg: '../../../../assets/img/main5.JPG'
          },
          {
            frase: "",
            url: '../../../../assets/img/sponsors/itesm.png',
            backImg: '../../../../assets/img/main5.JPG'
          },
          {
            frase: "",
            url: '../../../../assets/img/sponsors/uanl.png',
            backImg: '../../../../assets/img/main5.JPG'
          },
          {
            frase: "",
            url: '../../../../assets/img/sponsors/uerre.jpg',
            backImg: '../../../../assets/img/main5.JPG'
          },
          {
            frase: "",
            url: '../../../../assets/img/sponsors/nuvasoft.png',
            backImg: '../../../../assets/img/main5.JPG'
          },
          {
            frase: "",
            url: '../../../../assets/img/sponsors/sofftek.png',
            backImg: '../../../../assets/img/main5.JPG'
          },
          {
            frase: "",
            url: '../../../../assets/img/sponsors/nic.jpg',
            backImg: '../../../../assets/img/main5.JPG'
          },
          {
            frase: "Apoyar a la educación y a la educación en tecnología debe ser estrategia a nivel país y no solo por el gobierno, sino que como empresas debemos invertir en nuestros futuros talentos y mostrarles que hay un país que los está esperando, un país que les muestra que hay futuro y futuro en tecnología. Apoyar a todos estos temas de capital humano nos hace sentir que sumamos un granito de arena al progreso del país, invertirmos en generar el talento que en un futuro será parte de nuestro contenido nacional. - Matías Bertoni",
            url: '../../../../assets/img/sponsors/tecnoap.jpg',
            backImg: '../../../../assets/img/main5.JPG'
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
