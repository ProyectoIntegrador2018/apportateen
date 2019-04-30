import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import { ApiService } from 'app/services/api/api.service';
import {User} from '../../../../models/user.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { ConfirmationDialog } from 'app/components/confirmation-dialog/confirmation-dialog.component';
export interface DialogData{

}

@Component({
  selector: 'app-usuarios-detalle',
  templateUrl: './usuarios-detalle.component.html',
  styleUrls: ['./usuarios-detalle.component.scss']
})
export class UsuariosDetalleComponent implements OnInit {
  idUsuario : string;
  nombreUsuario : string;
  apellidoUsuario : string;
  fechaNacimientoUsuario : string;
  correoUsuario : string;
  telefonoUsuario : string;
  curpUsuario : string;
  escuelaUsuario : string;
  sexoUsuario : string;
  tutorNombreUsuario : string;
  tutorCorreoUsuario : string;
  tutorTelefonoUsuario : string;
  escuelaTipoUsuario : string;
  escuelaGradoUsuario : string;
  experenciaUsuario : string;
  haParticipadoUsuario : string;
  becaUsuario : string;
  detalleExperenciaUsuario : string;
  referenciaUsuario : string;
  numEdicionUsuario : string;

  listaArchivos : any;

  usuario : User = new User();

  constructor(public dialogRef: MatDialogRef<UsuariosDetalleComponent>, 
    @Inject(MAT_DIALOG_DATA) public result: DialogData, 
    private api: ApiService, 
    public snackBar: MatSnackBar, 
    public dialog: MatDialog, 
    private storage: AngularFireStorage) { }

  ngOnInit() {
    this.listaArchivos = [];
  
    this.idUsuario = this.result['row']['id'];
    this.api.getUserById(this.idUsuario).subscribe(result => {
      this.usuario = result;
      this.nombreUsuario = result.nombre;
      this.apellidoUsuario = result.apellido;
      this.fechaNacimientoUsuario = result.fecha_nacimiento;
      this.telefonoUsuario = result.telefono;
      this.curpUsuario = result.curp;
      this.escuelaUsuario = result.escuela;
      this.sexoUsuario = result.sexo;
      this.tutorNombreUsuario = result.tutor_nombre;
      this.tutorCorreoUsuario = result.tutor_correo;
      this.tutorTelefonoUsuario = result.tutor_telefono;
      this.escuelaTipoUsuario = result.escuela_tipo;
      this.escuelaGradoUsuario = result.escuela_grado;
      this.experenciaUsuario = result.experiencia;
      this.haParticipadoUsuario = result.exAlumno;
      this.becaUsuario = result.beca;
      this.detalleExperenciaUsuario = result.detalle_exp;
      this.referenciaUsuario = result.referencia;
      this.numEdicionUsuario = null;
    });

    this.getArchivos();

    
  }

  //Metodo utilizado para actualizar la informacion del usuario
  guardar() {
    this.usuario.nombre = this.nombreUsuario;
    this.usuario.apellido = this.apellidoUsuario;
    this.usuario.fecha_nacimiento = this.formatDate(this.fechaNacimientoUsuario);
    this.usuario.telefono = this.telefonoUsuario;
    this.usuario.curp = this.curpUsuario;
    this.usuario.escuela = this.escuelaUsuario;
    this.usuario.sexo = this.sexoUsuario;
    this.usuario.tutor_nombre = this.tutorNombreUsuario;
    this.usuario.tutor_correo = this.tutorCorreoUsuario;
    this.usuario.tutor_telefono = this.tutorTelefonoUsuario;
    this.usuario.escuela_tipo = this.escuelaTipoUsuario;
    this.usuario.escuela_grado = this.escuelaGradoUsuario;
    this.usuario.experiencia = this.experenciaUsuario;
    this.usuario.ha_participado = this.haParticipadoUsuario;
    this.usuario.beca = this.becaUsuario;
    this.usuario.referencia = this.referenciaUsuario;
    this.usuario.num_Edi = this.numEdicionUsuario;

    console.log(this.usuario);
    this.api.updateUserCompelte(this.usuario).subscribe(res => {
      this.snackBar.open(res.message, '', {
        duration: 1000
      });
    }, error => {
      this.snackBar.open(error.erro, '', {
        duration: 1000
      });
    })
    
  }

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [day, month, year].join('-');
}

  deleteArchivo(path) {
    var archivoRef = this.storage.ref(path);

    const dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: true
    });

    dialogRef.componentInstance.mensajeConfirmacion = `Se eliminará este documento. ¿Desea continuar?`;

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        archivoRef.delete().subscribe(res => {
          console.log(path);
          this.api.deleteArchivoAdmn(path).subscribe(res => {
            this.snackBar.open(res.message, '', {
              duration: 1300
            });
            this.getArchivos();
          }, error => {
            this.snackBar.open(error.error, '', {
              duration: 1300
            });
          })
        })
      }
    })
}

getArchivos() {
  this.api.getAllArchivosById(this.idUsuario).subscribe(result => {
    this.listaArchivos = result[0];
    console.log(this.listaArchivos);
  })
}

}
