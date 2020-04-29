import { Component, OnInit, Inject, NgModule } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { Sede } from 'app/models/sede.model';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { User } from 'app/models/user.model';
import { Taller } from 'app/models/taller.model';
import { MatDialog, MatSnackBar,MAT_DIALOG_DATA, MatDialogRef, MatSelectModule } from '@angular/material';
import { ConfirmationDialog } from 'app/components/confirmation-dialog/confirmation-dialog.component';
import { WarningDialogComponent } from 'app/components/warning-dialog/warning-dialog.component';
import { TalleresComponent } from 'app/components/admin/talleres/talleres.component';

export interface DialogData{

}

@NgModule({
  imports:[MatSelectModule]
})
@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.component.html',
  styleUrls: ['./inscripcion.component.scss']
})
export class InscripcionComponent implements OnInit {
  estatus: boolean;
  user: User = new User();
  // tallerActual;
  talleres;
  sedes;
  selectedSede: Sede = new Sede();
  sede_seleccionada : boolean;
  muestra_todos : boolean;
  checa_talleres: boolean;
  talleres_usuario : Taller[];
  muestra_tusuario: boolean;
  sedeselect;

  constructor(private api: ApiService,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) {
    this.talleres = [];
    this.sedes = [];
    // this.tallerActual = '';
    this.estatus = null;
    this.sede_seleccionada = null;
    this.muestra_todos = true;
    
    this.talleres_usuario = [];
    this.checa_talleres = true;
    this.muestra_tusuario;
  }

  ngOnInit() {
    this.user = this.storage.get('@user:data');
    this.cargarSedes();
    this.cargarTalleres();
    

  }

  cargarSedes() {
    this.api.getEstatusConvocatorias().subscribe(status => {
      this.estatus = status.estatus;
      if (this.estatus) {
        this.api.getAllSedes().subscribe(result => {
          this.sedes = result;
          // if (this.user.idtaller != 0) {
          //   this.obtenerTallerActual();
          // }
        })
      }
    })

  }

  cargarTalleres(){
    this.api.getAllTalleres().subscribe(result => {
      this.talleres = result[0];
      this.muestra_todos = true;
      this.muestra_tusuario = false;
      
      // this.cargarTalleresUsuario();
      this.sedeselect = undefined;
      this.cargaTu();
    });

    
    
  }

  cargaTu(){

    let t:any;
    this.talleres_usuario = [];

    console.log(this.user.talleres);
    console.log(this.talleres);
    for(t in this.user.talleres){
      
      let temp = this.talleres.find(x => x.id === this.user.talleres[t]);
      
      this.talleres_usuario.push(temp);
      
      
    }
    
  }

  cargarTalleresUsuario(){
    let t:any;
    
    console.log(this.talleres_usuario.length + " " +this.user.talleres.length);
    
    // if(!(this.talleres_usuario.length === this.user.talleres.length)){
    //   this.talleres_usuario = [];
    //   for(t in this.user.talleres){
        
    //     this.talleres_usuario.push(this.talleres.find(x => x.id === this.user.talleres[t]));
    //     // console.log("hola "+ this.talleres_usuario);
    //   }
    // }

    this.cargaTu();
    
    this.muestra_todos = false;
    this.muestra_tusuario = true;
    this.sedeselect = undefined;
  }

  seleccionarSede(event: any) {
    this.selectedSede = this.sedes.find(x => x.id === event.value);
    this.selectedSede.talleres = this.selectedSede.talleres.filter(x => x.categoria === this.user.idcategoria);
    this.sede_seleccionada = true;
    this.muestra_todos = false;
    this.muestra_tusuario = false;
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
        
        this.user.id_axtuser = ""; // para qué es este id ??
        
        const index_taller = this.user.talleres.indexOf(taller.id);
        
        if(index_taller > -1){
          this.user.talleres.splice(index_taller,1);
        }

        this.cargaTu();


          
        this.api.updateUser(this.user).subscribe(res => {
          this.storage.set('@user:data', this.user);
          // this.tallerActual = '';
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

    // sección para checar que el usuario puede inscribir otro taller dependiendo del horario y fecha de los talleres que ya tiene inscritos
    let t : any;
    for(t in this.talleres_usuario){
      
      // let tall = this.talleres.find(x => x.id === this.user.talleres[t]);
    
      var fi= this.talleres_usuario[t].fecha_inicio.slice(0,10);
      var ff = this.talleres_usuario[t].fecha_fin.slice(0,10);
      var fi_n = taller.fecha_inicio.slice(0,10);
      var ff_n = taller.fecha_fin.slice(0,10);
      
      fi = fi.split("-").join("");
      ff = ff.split("-").join("");
      fi_n = fi_n.split("-").join("");
      ff_n = ff_n.split("-").join("");
      
      var hi = this.talleres_usuario[t].hora_inicio.replace(":","");
      var hf = this.talleres_usuario[t].hora_fin.replace(":","");
      var hi_n = taller.hora_inicio.replace(":","");
      var hf_n = taller.hora_fin.replace(":","");

      // checar si los rangos de fechas del nuevo taller a inscribir estan dentro de los rangos de fechas de los talleres ya inscritos
      // TODO: más pruebas de esto

      if((fi_n >= fi && ff >= fi_n) || (ff_n >= fi && ff >= ff_n)){
        // checa si las horas del nuevo taller coinciden dentro de las horas de los talleres que ya tiene inscritos

        if((hi_n >= hi && hf >= hi_n) || (hf_n >= hi && hf >= hf_n) || taller.estado != this.talleres_usuario[t].estado){
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
        
        this.cargaTu();
        


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
          // this.obtenerTallerActual()
          this.cargarSedes();
          this.snackBar.open(res.message, '', {
            duration: 1500,
          });
        }, error => {
          this.snackBar.open(error.error, '', {
            duration: 900,
          });
        })
      } else{
        this.checa_talleres = true; //resetea valor
      }
    })
  }
}
