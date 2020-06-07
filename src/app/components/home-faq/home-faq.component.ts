import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { log } from 'util';
import { ApiService } from '../../services/api/api.service';


@Component({
    selector: 'home-faq',
    templateUrl: './home-faq.component.html',
    styleUrls: ['./home-faq.component.scss']
})

export class HomeFAQComponent {
    preguntas;

    constructor(public snackBar: MatSnackBar, private api: ApiService) {
        this.preguntas = [{
          pregunta:'¿Qué es Apportateen?',
          respuesta:'Axt@Teen 2020 es un programa intensivo para promover entre estudiantes de México, desde nivel elemental hasta Preparatoria, el gusto por las Tecnologías de Información y el desarrollo del pensamiento computacional.'
        },
        {
          pregunta:'¿Cómo puedo inscribir un taller?',
          respuesta:'Se puede ver la oferta de talleres en la página principal del sitio. Cuando se sepa que taller se quiere inscribir, se puede ir a la sección de talleres, seleccionar el correcto y hacer click en “inscribir”'
        },
        {
          pregunta:'¿Cómo puedo pagar un taller?',
          respuesta:'En la sección de Talleres Inscritos puedes imprimir la ficha de pago de cada taller y subir el comprobante una vez realizado el pago. Cualquier duda favor de contactar a angelica.cisneros@csoftmty.org'
        },
        {
          pregunta:'¿Cuál es el costo de un taller?',
          respuesta:'En la sección de Inscripciones puedes dar click en cualquier taller para saber toda la información del costo, fecha, lugar, etc.',
          extra:'*Los talleres en las sedes Softtek y UDEM son totalmente gratuitos.'
        },
        {
          pregunta:'¿Cuándo es la fecha limite para pagar los talleres?',
          respuesta:'La fecha limite para hacer la inscripción y el pago de los talleres es una semana anterior a fecha de inicio taller.'
        },
      ];
    }


}
