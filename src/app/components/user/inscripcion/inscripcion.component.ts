import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { Sede } from 'app/models/sede.model';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { User } from 'app/models/user.model';
import { Taller } from 'app/models/taller.model';
import { MatDialog, MatSnackBar,MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ConfirmationDialog } from 'app/components/confirmation-dialog/confirmation-dialog.component';
import { TalleresComponent } from 'app/components/admin/talleres/talleres.component';

export interface DialogData{

}

@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.component.html',
  styleUrls: ['./inscripcion.component.scss']
})
export class InscripcionComponent implements OnInit {
  estatus: boolean;
  user: User = new User();
  tallerActual;
  talleres;
  sedes;
  selectedSede: Sede = new Sede();
  sede_seleccionada : boolean;
  muestra_todos : boolean;

  constructor(private api: ApiService,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) {
    this.talleres = [];
    this.sedes = [];
    this.tallerActual = '';
    this.estatus = null;
    this.sede_seleccionada = null;
    this.muestra_todos = true;
  }

  ngOnInit() {
    this.user = this.storage.get('@user:data');
    this.cargarSedes();
    this.cargarTalleres();
    console.log(this.user);
    

  }

  cargarSedes() {
    this.api.getEstatusConvocatorias().subscribe(status => {
      this.estatus = status.estatus;
      if (this.estatus) {
        this.api.getAllSedes().subscribe(result => {
          this.sedes = result;
          if (this.user.idtaller != 0) {
            this.obtenerTallerActual();
          }
        })
      }
    })

  }

  cargarTalleres(){
    this.api.getAllTalleres().subscribe(result => {
      this.talleres = result[0];
      this.muestra_todos = true;
      console.log(this.talleres);
    })
  }

  seleccionarSede(event: any) {
    this.selectedSede = this.sedes.find(x => x.id === event.value);
    this.selectedSede.talleres = this.selectedSede.talleres.filter(x => x.categoria === this.user.idcategoria);
    this.sede_seleccionada = true;
    this.muestra_todos = false;
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

        this.user.id_axtuser = ""; // para qué es este id ??
        
        const index_taller = this.user.talleres.indexOf(taller.id);
        if(index_taller > -1){
          this.user.talleres.splice(index_taller,1);
        }
          
        this.api.updateUser(this.user).subscribe(res => {
          this.storage.set('@user:data', this.user);
          this.tallerActual = '';
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

  inscripcion(taller: Taller) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: true
    });
    

    // sección para checar que el usuario puede inscribir otro taller dependiendo del horario y fecha de los talleres que ya tiene inscritos
    let t : any;
    for(t in this.user.talleres){
      
      let tall = this.talleres.find(x => x.id === this.user.talleres[t]);
      console.log(tall.fecha_inicio);
      
      var fecha_1 = tall.fecha_inicio.slice(0,10);

      // 2020-04-30T05:00:00.000Z

    }

    let message = `Está por inscribirse al taller ${taller.nombre}. ¿Desea continuar?`;
    // if (this.user.idtaller != 0) {
    //   message = `Se identificó que ya estas registrado en otro taller. Si desea estar inscrito simultáneamente en dos o más talleres, deberas crear un nuevo usuario por cada nuevo registro que deseaa realizar. En caso de querer reemplazar el taller inscrito actual, se reemplazará la inscripción actual por el taller ${taller.nombre}. ¿Desea continuar?`;
    // }

    dialogRef.componentInstance.mensajeConfirmacion = message;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        
        // this.user.idtaller = taller.id;
        this.user.talleres.push(taller.id);
        
        this.user.id_axtuser = (this.selectedSede.nombre).toUpperCase() + "-" + (taller.nombre) + taller.inscritos;
        
        if (this.selectedSede.nombre === "SOFTTEK" || this.selectedSede.nombre === "UDEM") {
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
          this.obtenerTallerActual()
          this.cargarSedes();
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

  obtenerTallerActual() {
    let sede = this.sedes.find(sede => sede.talleres.some(item => item.id === this.user.idtaller));
    this.tallerActual = `${sede.talleres.find(x => x.id === this.user.idtaller).nombre} - ${sede.nombre}`;
  }

}
