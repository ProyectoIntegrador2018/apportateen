
import { AvisoInscripcionComponent } from './aviso-inscripcion/aviso-inscripcion.component';

import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { Taller } from 'app/models/taller.model';
import { User } from 'app/models/user.model';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';

import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatDialog, MatSnackBar,MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ConfirmationDialog } from 'app/components/confirmation-dialog/confirmation-dialog.component';



@Component({
  selector: 'app-detalle-taller',
  templateUrl: './detalle-taller.component.html',
  styleUrls: ['./detalle-taller.component.scss']
})
export class DetalleTallerComponent implements OnInit {

  idTaller;
  taller;

  costo;

  estatus;
  user: User = new User();

  constructor(private api: ApiService,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,

    private route: ActivatedRoute,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) {
    this.taller = Taller;
    this.estatus = null;
  }

  ngOnInit() {
    //obtener Id del taller
    this.route.paramMap.subscribe(params => {
      this.idTaller = +params.get('id');
    });
    this.cargarTaller();



    //datos del usuario para obtener el costo dependiendod el tipo de escuela
    this.user = this.storage.get('@user:data');

    window.scrollTo(0, 0);
  }

  cargarTaller() {
    this.api.getTaller(this.idTaller).subscribe(result => {
      this.taller = result[0][0];
      this.taller["inscritos"] = result[1][0]["inscritos"];
    })
  }

  costoTaller(): number {
    if (this.taller["sedeDesc"] == "UDEM" || this.taller["sedeDesc"] == "SOFTTEK") {
      return 0;
    } else {
      if (this.user.escuela_tipo == "Privada") {
        return 1700;
      } else {
        return 700;
      }
    }
  }

  inscripcion(taller: Taller) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: true
    });
    let message = `Está por inscribirse al taller ${taller.nombre}. ¿Desea continuar?`;
    // if (this.user.idtaller != 0) {
    //   message = `Se identificó que ya estas registrado en otro taller. Si desea estar inscrito simultáneamente en dos o más talleres, deberas crear un nuevo usuario por cada nuevo registro que deseaa realizar. En caso de querer reemplazar el taller inscrito actual, se reemplazará la inscripción actual por el taller ${taller.nombre}. ¿Desea continuar?`;
    // }

    dialogRef.componentInstance.mensajeConfirmacion = message;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {


        // this.user.idtaller = taller.id;
        this.user.talleres.push(taller.id);

        this.user.id_axtuser = taller["sededesc"].toUpperCase() + "-" + (taller.nombre) + taller.inscritos;
        if (taller["sededesc"] === "SOFTTEK" || taller["sededesc"] === "UDEM") {
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
        }, error => {
          this.snackBar.open(error.error, '', {
            duration: 900,
          });
        })
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
