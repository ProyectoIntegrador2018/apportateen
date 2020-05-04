import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete, MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Aviso } from 'app/models/aviso.model';
import { ApiService } from '../../services/api/api.service';

export interface AvisosData {
  posiblesDestinararios,
  destinatariosactuales,
  target: number,
  edit: boolean
}

/**
 * @title Basic chips
 */
@Component({
  selector: 'avisos-dialog',
  templateUrl: './avisos-dialog.component.html',
  styleUrls: ['./avisos-dialog.component.scss']
})
export class AvisosDialog {
  //Chips
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  destinatarioCtrl = new FormControl();
  filteredDestinatarios: Observable<string[]>;
  destinatariosSeleccionados: any = [];
  posiblesDestinatarios: any = [];

  //Avisos
  aviso = new Aviso;
  targetMessage: string

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private api: ApiService,
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AvisosDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AvisosData) {
    this.posiblesDestinatarios = this.data.posiblesDestinararios
    this.filteredDestinatarios = this.destinatarioCtrl.valueChanges.pipe(
      startWith(''),
      map((destinatario: string | null) => destinatario ? this._filter(destinatario) : this.posiblesDestinatarios.slice()));

    this.aviso.titulo = "";
    this.aviso.mensaje = "";

    if (this.data.target === 1) {
      this.targetMessage = 'General';
    }
    else if (this.data.target === 2) {
      this.targetMessage = 'por Taller';
    }
    else if (this.data.target === 3) {
      this.targetMessage = 'por Sede';
    }
    else if (this.data.target === 4) {
      this.targetMessage = 'a Responsables';
      var i = 0;
      this.posiblesDestinatarios.forEach(sede => {
        if (sede.correo_responsable == null) {
          this.posiblesDestinatarios.splice(i, 1)
        }
        i += 1;
      })
    }

  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    input.value = '';
    this.destinatarioCtrl.setValue(null);
  }

  remove(destinatario, indx): void {
    this.destinatariosSeleccionados.splice(indx, 1);
    this.posiblesDestinatarios.splice(0, 0, destinatario);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.destinatariosSeleccionados.includes(event.option.value)) {
      this.destinatariosSeleccionados.push(event.option.value);
      this.fruitInput.nativeElement.value = '';
      this.destinatarioCtrl.setValue(null);
    }
  }

  removeValueFromPossibles(indx) {
    this.posiblesDestinatarios.splice(indx, 1);
  }

  private _filter(value: any): any[] {
    return this.posiblesDestinatarios.filter(destinatario => destinatario.nombre.toString().toLowerCase().includes(value.toString().toLowerCase()));
  }

  onNoClick(): void {
    this.destinatariosSeleccionados.forEach(destionatario => {
      this.posiblesDestinatarios.unshift(destionatario)
    })
    this.aviso = new Aviso
    this.dialogRef.close();
  }

  enviar(): void {
    if (this.data.target === 1) {
      this.aviso.sedes = null;
      this.aviso.talleres = null;
      this.aviso.global = true;

    }
    else if (this.data.target === 2) {
      this.aviso.sedes = null;
      this.aviso.talleres = [];
      this.destinatariosSeleccionados.forEach(taller => {
        this.aviso.talleres.push(taller.id)
      });

    }
    else if (this.data.target === 3) {
      this.aviso.talleres = null;
      this.aviso.sedes = [];
      this.destinatariosSeleccionados.forEach(sede => {
        this.aviso.sedes.push(sede.id)
      });
    }
    else if (this.data.target === 4) {
      var emails = [];
      this.destinatariosSeleccionados.forEach(sede => {
        emails.push(sede.correo_responsable)
      });
      window.location.href = `mailto:?bcc=${emails}`;
    }

    this.api.createAviso(this.aviso).subscribe(result => {
      this.snackBar.open(result.message, '', {
        duration: 2000
      });
      this.dialogRef.close(true)
    });

    this.dialogRef.close(true)

    this.destinatariosSeleccionados.forEach(destionatario => {
      this.posiblesDestinatarios.unshift(destionatario)
    })

    this.aviso = new Aviso
  }

  guardar(){

    this.dialogRef.close(true)
    this.destinatariosSeleccionados.forEach(destionatario => {
      this.posiblesDestinatarios.unshift(destionatario)
    })
    this.aviso = new Aviso
  }
}