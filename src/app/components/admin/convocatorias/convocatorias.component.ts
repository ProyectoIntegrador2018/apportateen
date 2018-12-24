import { Component } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmationDialog } from 'app/components/confirmation-dialog/confirmation-dialog.component';


@Component({
    selector: 'convocatorias',
    templateUrl: './convocatorias.component.html',
    styleUrls: ['./convocatorias.component.scss']
})

export class ConvocatoriasComponent {
    estatus;
    disabled;
    constructor(private api: ApiService, public dialog: MatDialog, public snackBar: MatSnackBar) {
        this.estatus = false;
        this.disabled = true;
    }

    ngOnInit() {
        this.obtenerEstatusConvocatorias();
    }

    obtenerEstatusConvocatorias() {
        this.api.getEstatusConvocatorias().subscribe(result => {
            this.disabled = false;
            this.estatus = result.estatus;
        })
    }

    alternar() {
        this.estatus = !this.estatus;
        const dialogRef = this.dialog.open(ConfirmationDialog, {
            disableClose: true
        });
        let message = 'Está por habilitar la inscripción a los talleres. ¿Desea continuar?';
        if (!this.estatus) {
            message = 'Se inhabilitará la inscripción a todos los talleres. ¿Desea continuar?';
        }
        dialogRef.componentInstance.mensajeConfirmacion = message;
        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.disabled = true;
                const cambio = { estatus: this.estatus };
                this.api.updateConvocatorias(cambio).subscribe(result => {
                    this.disabled = false;
                    this.snackBar.open(result.message, '', {
                        duration: 1400
                    });
                }, error => {
                    this.snackBar.open(error.error, '', {
                        duration: 900
                    });
                    this.disabled = false;
                    this.estatus = !this.estatus;
                })
            } else {
                this.estatus = !this.estatus;
            }
        })
    }
}