import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { Sede } from 'app/models/sede.model';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { User } from 'app/models/user.model';
import { Taller } from 'app/models/taller.model';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmationDialog } from 'app/components/confirmation-dialog/confirmation-dialog.component';

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

  constructor(private api: ApiService,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) {
    this.talleres = [];
    this.sedes = [];
    this.tallerActual = '';
    this.estatus = null;
  }

  ngOnInit() {
    this.user = this.storage.get('@user:data');
    this.cargarSedes();
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

  seleccionarSede(event: any) {
    this.selectedSede = this.sedes.find(x => x.id === event.value);
    this.selectedSede.talleres = this.selectedSede.talleres.filter(x => x.categoria === this.user.idcategoria);
  }

  quitarInscripcion() {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: true
    });
    dialogRef.componentInstance.mensajeConfirmacion = `Se eliminará su inscripción a este taller. ¿Desea continuar?`;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.user.idtaller = 0;
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
    let message = `Está por inscribirse al taller ${taller.nombre}. ¿Desea continuar?`;
    if (this.user.idtaller != 0) {
      message = `Se reemplazará la inscripción actual por el taller ${taller.nombre}. ¿Desea continuar?`;
    }

    dialogRef.componentInstance.mensajeConfirmacion = message;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.user.idtaller = taller.id;
        this.api.updateUser(this.user).subscribe(res => {
          this.storage.set('@user:data', this.user);
          this.obtenerTallerActual();
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
