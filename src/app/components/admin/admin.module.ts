import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { FormsModule } from '@angular/forms';

import { MatSidenavModule, MatIconModule, MatToolbarModule, MatListModule, MatSlideToggleModule, MatButtonModule, MatInputModule, MatExpansionModule, MatSelectModule, MatDialogModule, MatSnackBarModule, MatMenuModule, } from '@angular/material'
import { ConvocatoriasComponent } from './convocatorias/convocatorias.component';
import { SedesComponent } from './sedes/sedes.component';
import { TalleresComponent } from './talleres/talleres.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { PatrocinadoresComponent } from './patrocinadores/patrocinadores.component';
import { AvisosComponent, ConfirmationDialog } from './avisos/avisos.component';
import { StorageServiceModule } from 'angular-webstorage-service';

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
        MatMenuModule
    ],
    declarations: [MainComponent,
        ConvocatoriasComponent,
        SedesComponent,
        TalleresComponent,
        CategoriasComponent,
        PatrocinadoresComponent,
        AvisosComponent,
        ConfirmationDialog
    ],
    exports: [MainComponent],
    entryComponents: [ConfirmationDialog]
})
export class AdminModule { }