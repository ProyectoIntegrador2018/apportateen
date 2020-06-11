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
            frase: "Ax@teen, es uno de los esfuerzos más exitosos que se han realizado para enamorar a los chicos de la tecnología, les abre puertas y posibilidades al futuro. Ax@teen, crea un ambiente colaborativo, de desarrollo y de crecimiento, no solo para los “teens” si no para quienes participan como instructores y hacer posible el programa. En Softtek tenemos claro que la industria de la información tiene un potencial enorme de exportación de soluciones y de servicios, y que impulsa el desarrollo de México; es por esto que necesitamos que más jóvenes consideren la industria de TI como su opción de desarrollo profesional;  es ahí donde Ax@teen abona, y es ahí donde como empresa mexicana de TI nos importa participar.",
            url: '../../../../assets/img/sponsors/sofftek.png',
            backImg: '../../../../assets/img/main5.JPG'
          },
          {
            frase: "Apoyar a la educación y a la educación en tecnología debe ser estrategia a nivel país y no solo por el gobierno, sino que como empresas debemos invertir en nuestros futuros talentos y mostrarles que hay un país que los está esperando, un país que les muestra que hay futuro y futuro en tecnología. Apoyar a todos estos temas de capital humano nos hace sentir que sumamos un granito de arena al progreso del país, invertirmos en generar el talento que en un futuro será parte de nuestro contenido nacional. - Matías Bertoni.",
            url: '../../../../assets/img/sponsors/tecnoap.jpg',
            backImg: '../../../../assets/img/main5.JPG'
          },
          {
            frase: "Ser parte de Axt@teen es una experiencia mágica de compañerismo, creatividad y mucho aprendizaje no solo para los teens, también para los que los acompañamos en este proceso, Axt@teen cambia vidas, es recordarlo y sonreír.",
            url: '../../../../assets/img/sponsors/sofftek.png',
            backImg: '../../../../assets/img/main5.JPG'
          },
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
            url: '../../../../assets/img/sponsors/nic.jpg',
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
