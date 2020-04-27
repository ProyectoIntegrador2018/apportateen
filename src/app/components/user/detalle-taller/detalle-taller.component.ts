import { MessageDialogComponent } from './../../message-dialog/message-dialog.component';

import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { Taller } from 'app/models/taller.model';
import { User } from 'app/models/user.model';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';

import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatDialog, MatSnackBar,MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ConfirmationDialog } from 'app/components/confirmation-dialog/confirmation-dialog.component';
import { WarningDialogComponent } from 'app/components/warning-dialog/warning-dialog.component';


@Component({
  selector: 'app-detalle-taller',
  templateUrl: './detalle-taller.component.html',
  styleUrls: ['./detalle-taller.component.scss']
})
export class DetalleTallerComponent implements OnInit {

  idTaller;
  taller;
  costo;
  costosPorEscuela;
  estatus;
  user: User = new User();
  talleres;
  checa_talleres: boolean;
  fecha_inicio;
  fecha_fin;

  constructor(private api: ApiService,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,

    private route: ActivatedRoute,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) {
    this.taller = Taller;
    this.estatus = null;
    this.checa_talleres = true;
    this.talleres = [];
    this.fecha_inicio;
    this.fecha_fin;
  }

  ngOnInit() {
    //obtener Id del taller

    this.route.paramMap.subscribe(params => {
      this.idTaller = +params.get('id');
    });
    this.cargarTaller();
    this.cargarTalleres();
    this.obtenerCostos();


    //datos del usuario para obtener el costo dependiendod el tipo de escuela
    this.user = this.storage.get('@user:data');

    window.scrollTo(0, 0);



  }


  cargarTalleres(){
    this.api.getAllTalleres().subscribe(result => {
      this.talleres = result[0];
      // this.muestra_todos = true;
      // console.log(this.talleres);
    })
  }

  cargarTaller() {
    this.api.getTaller(this.idTaller).subscribe(result => {
      console.log(result);
      this.taller = result[0][0];
      this.taller["inscritos"] = result[1][0]["inscritos"];

      this.fecha_fin = this.taller.fecha_fin;
      this.fecha_inicio = this.taller.fecha_inicio;


      this.fecha_inicio = this.formatDate(this.fecha_inicio.slice(0,10));
      this.fecha_fin = this.formatDate(this.fecha_fin.slice(0,10));

    })


  }

  formatDate(x:string) {

    let dias = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];
    let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    let date = new Date(x.replace(/-+/g, '/'));

    var fechaNum = date.getDate();
    var mes_name = date.getMonth();


    return(dias[date.getDay()-1] + " " + fechaNum + " de " + meses[mes_name] + " de " + date.getFullYear());

  }


  obtenerCostos() {
    this.api.getCostos().subscribe(result => {
      this.costosPorEscuela = result;
      console.log(result);
    });
  }


  costoTaller(): number {
    if (this.taller["gratis"]) {
      return 0;
    } else {
      if (this.user.escuela_tipo == "Privada") {
        return this.costosPorEscuela["escuela_privada"];
      } else {
        return this.costosPorEscuela["escuela_publica"];
      }
    }
  }

  inscripcion(taller: Taller) {
  // sección para checar que el usuario puede inscribir otro taller dependiendo del horario y fecha de los talleres que ya tiene inscritos
  let t : any;
  for(t in this.user.talleres){
    let tall = this.talleres.find(x => x.id === this.user.talleres[t]);


    var fi= tall.fecha_inicio.slice(0,10);
    var ff = tall.fecha_fin.slice(0,10);
    var fi_n = taller.fecha_inicio.slice(0,10);
    var ff_n = taller.fecha_fin.slice(0,10);

    fi = fi.split("-").join("");
    ff = ff.split("-").join("");
    fi_n = fi_n.split("-").join("");
    ff_n = ff_n.split("-").join("");

    var hi = tall.hora_inicio.replace(":","");
    var hf = tall.hora_fin.replace(":","");
    var hi_n = taller.hora_inicio.replace(":","");
    var hf_n = taller.hora_fin.replace(":","");


    // checar si los rangos de fechas del nuevo taller a inscribir estan dentro de los rangos de fechas de los talleres ya inscritos
    // TODO: más pruebas de esto
    if((fi_n >= fi && ff >= fi_n) || (ff_n >= fi && ff >= ff_n)){
      // checa si las horas del nuevo taller coinciden dentro de las horas de los talleres que ya tiene inscritos

      if((hi_n >= hi && hf >= hi_n) || (hf_n >= hi && hf >= hf_n) || taller.estado != tall.estado){
        this.checa_talleres = false;
      }
    }

  }
  let dialogRef, message;

  if(!this.checa_talleres){
    dialogRef = this.dialog.open(WarningDialogComponent);
  } else {

    dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: true
    });

    message = `Está por inscribirse al taller ${taller.nombre} en el estado de ${taller.estado}. ¿Desea continuar?`;
    dialogRef.componentInstance.mensajeConfirmacion = message;
  }

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.checa_talleres) {
        // this.user.idtaller = taller.id;
        this.user.talleres.push(taller.id);

        this.user.id_axtuser = taller["sededesc"].toUpperCase() + "-" + (taller.nombre) + taller.inscritos;
        if (taller["gratis"]) {
          this.user.num_conf_pago = "BECA";
          this.api.updateUsuarioNumConfPago(this.user).subscribe(res => {
          }, error => {
            this.snackBar.open(error.error, '', {
              duration: 900,
            });
          });
        }
        this.api.updateUser(this.user).subscribe(res => {
          this.storage.set('@user:data', this.user);
          this.snackBar.open(res.message, '', {
            duration: 1500,
          });
          if(this.costoTaller() != 0){
            const dialogRef = this.dialog.open(MessageDialogComponent, {
              disableClose: true
            });
            let message = `Para terminar tu inscripción al taller ${taller.nombre}, necesitarás completar el pago. En tu sección de talleres inscritos, podrás descargar la ficha de pago y subir el comprobante una vez realizado.`;
            dialogRef.componentInstance.mensaje = message;
            dialogRef.componentInstance.titulo = "¡Ya casi estas inscrito!";
          }
        }, error => {
          this.snackBar.open(error.error, '', {
            duration: 900,
          });
        })
      } else {
        this.checa_talleres = true; //resetea valor
      }
    })
  }


  quitarInscripcion(taller: Taller) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: true
    });
    dialogRef.componentInstance.mensajeConfirmacion = `Se eliminará su inscripción a este taller. ¿Desea continuar?`;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.user.num_conf_pago = "";
        this.api.updateUsuarioNumConfPago(this.user).subscribe(res => {
        }, error => {
          this.snackBar.open(error.error, '', {
            duration: 900,
          });
        });
        this.user.idtaller = 0;
        this.user.id_axtuser = "";

        const index_taller = this.user.talleres.indexOf(taller.id);
        if(index_taller > -1){
          this.user.talleres.splice(index_taller,1);
        }


        this.api.updateUser(this.user).subscribe(res => {
          this.storage.set('@user:data', this.user);
          this.snackBar.open(res.message, '', {
            duration: 1500,
          });
        }, error => {
          this.snackBar.open(error.error, '', {
            duration: 900,
          });
        })
      }
    })
  //   let dialogDetalle = this.dialog.open(AvisoInscripcionComponent, {
  //     width: '800px',
  //     data: {id : this.user.id}
  // });
  }

}
