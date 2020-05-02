import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { log } from 'util';
import { ApiService } from '../../services/api/api.service';


@Component({
    selector: 'home-gallery',
    templateUrl: './home-gallery.component.html',
    styleUrls: ['./home-gallery.component.scss']
})

export class HomeGalleryComponent {
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
          respuesta:'Se puede pagar un taller si se genera la ficha de pago correspondiente, se realiza un pago y se manda un correo con el comprobante de pago y los datos de la persona inscrita al correo: angelica.cisneros@csoftmty.org'
        },
        {
          pregunta:'¿Cuál es el costo de un taller?',
          respuesta:'Los costos de los talleres son: $1,500 si el alumno es proveniente de una escuela privada y $500 si proviene de una escuela publica.'
        },
        {
          pregunta:'¿Cuál es el costo de un taller?',
          respuesta:'Los costos de los talleres son: $1,500 si el alumno es proveniente de una escuela privada y $500 si proviene de una escuela publica.',
          extra:'*Los talleres en las sedes Softtek y UDEM son totalmente gratuitos.'
        },
        {
          pregunta:'¿Cuándo es la fecha limite para pagar los talleres?',
          respuesta:'La fecha limite para hacer la inscripción y el pago de los talleres es una semana anterior a fecha de inicio taller.'
        },
      ];
    }

    
}
