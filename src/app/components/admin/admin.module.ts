import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { FormsModule } from '@angular/forms';

import { MatSidenavModule, MatIconModule, MatToolbarModule, MatListModule, MatSlideToggleModule, MatButtonModule, MatInputModule, MatExpansionModule, MatSelectModule, MatDialogModule, MatSnackBarModule, MatMenuModule, MatTableModule, } from '@angular/material'
import { ConvocatoriasComponent } from './convocatorias/convocatorias.component';
import { SedesComponent } from './sedes/sedes.component';
import { TalleresComponent } from './talleres/talleres.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { PatrocinadoresComponent } from './patrocinadores/patrocinadores.component';
import { AvisosComponent } from './avisos/avisos.component';
import { StorageServiceModule } from 'angular-webstorage-service';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog.component';
import { CorreosComponent } from './correos/correos.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        MatSidenavModule,
        MatIconModule,
        MatToolbarModule,
        MatListModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatInputModule,
        MatExpansionModule,
        MatSelectModule,
        MatDialogModule,
        MatSnackBarModule,
        StorageServiceModule,
        MatMenuModule,
        MatTableModule
    ],
    declarations: [MainComponent,
        ConvocatoriasComponent,
        SedesComponent,
        TalleresComponent,
        CategoriasComponent,
        PatrocinadoresComponent,
        AvisosComponent,
        CorreosComponent
    ],
    exports: [MainComponent]
})
export class AdminModule { }