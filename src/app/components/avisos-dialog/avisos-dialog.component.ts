import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete, MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Aviso } from 'app/models/aviso.model';
import { ApiService } from '../../services/api/api.service';

export interface AvisosData {
  posiblesDestinararios: any[],
  destinatariosactuales: any[],
  target: number,
  edit: boolean,
  aviso: Aviso
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
    console.log(this.data.posiblesDestinararios);
    if (this.data.posiblesDestinararios != null) {
      this.posiblesDestinatarios = JSON.parse(JSON.stringify(this.data.posiblesDestinararios)); //Clone object if not general
    }

    this.filteredDestinatarios = this.destinatarioCtrl.valueChanges.pipe(
      startWith(''),
      map((destinatario: string | null) => destinatario ? this._filter(destinatario) : this.posiblesDestinatarios.slice()));

    if (!this.data.edit) {
      this.aviso.titulo = "";
      this.aviso.mensaje = "";
    } else {
      if (this.data.destinatariosactuales != null) {
        this.destinatariosSeleccionados = JSON.parse(JSON.stringify(this.data.destinatariosactuales));
        console.log(this.data.destinatariosactuales, this.destinatariosSeleccionados)
      }
      this.aviso = JSON.parse(JSON.stringify(this.data.aviso));
    }

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
    console.log(this.destinatariosSeleccionados)
  }

  removeValueFromPossibles(indx) {
    this.posiblesDestinatarios.splice(indx, 1);
  }

  private _filter(value: any): any[] {
    return this.posiblesDestinatarios.filter(destinatario => destinatario.nombre.toString().toLowerCase().includes(value.toString().toLowerCase()));
  }

  onNoClick(): void {
    this.aviso = new Aviso
    this.dialogRef.close();
  }

  enviar(): void {
    if (this.data.target === 1) {
      this.aviso.sede = null;
      this.aviso.taller = null;
      this.aviso.general = true;

    }
    else if (this.data.target === 2) {
      this.aviso.sede = null;
      this.aviso.taller = [];
      this.destinatariosSeleccionados.forEach(taller => {
        this.aviso.taller.push(taller.id)
      });

    }
    else if (this.data.target === 3) {
      this.aviso.taller = null;
      this.aviso.sede = [];
      this.destinatariosSeleccionados.forEach(sede => {
        this.aviso.sede.push(sede.id)
      });
    }
    else if (this.data.target === 4) {
      var emails = [];
      this.destinatariosSeleccionados.forEach(sede => {
        emails.push(sede.correo_responsable)
      });
      window.location.href = `mailto:?bcc=${emails}`;
      this.dialogRef.close(true);
    }

    if (this.data.target != 4) {
      this.api.createAviso(this.aviso).subscribe(result => {
        this.aviso = new Aviso
        this.dialogRef.close(true)
      }, error => {
        this.snackBar.open('Error al enviar el aviso, intente nuevamente', '', {
          duration: 3500
        });
      });
    }
  }

  guardar() {
    console.log(this.aviso)
    console.log(this.aviso.titulo, this.aviso.mensaje, this.aviso.id)
    this.api.updateAviso(this.aviso).subscribe(res => {
      this.snackBar.open(res.message, '', {
        duration: 3000
      });
      this.aviso = new Aviso
      this.dialogRef.close(true)
        , error => {
          this.snackBar.open("Error al guardar el aviso, intente de nuevo", '', {
            duration: 3000
          });
        }
    });
  }
}