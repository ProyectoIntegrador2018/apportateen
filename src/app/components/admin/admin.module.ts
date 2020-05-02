import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { FormsModule } from '@angular/forms';
import {MatStepperModule, MatProgressSpinnerModule, MatCheckbox} from '@angular/material';
import { MatSidenavModule, MatIconModule, MatToolbarModule, MatListModule, MatSlideToggleModule, MatButtonModule, MatInputModule, MatExpansionModule, MatSelectModule, MatDialogModule, MatSnackBarModule, MatMenuModule, MatTableModule, MatCheckboxModule,MatCardModule} from '@angular/material'
import { ConvocatoriasComponent } from './convocatorias/convocatorias.component';
import { SedesComponent } from './sedes/sedes.component';
import { TalleresComponent } from './talleres/talleres.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { PatrocinadoresComponent } from './patrocinadores/patrocinadores.component';
import { AvisosComponent } from './avisos/avisos.component';
import { StorageServiceModule } from 'angular-webstorage-service';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog.component';
import { CorreosComponent } from './correos/correos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuariosDetalleComponent } from './usuarios/usuarios-detalle/usuarios-detalle.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/storage';
import { AdministracionRolesComponent } from './administracion-roles/administracion-roles.component';
import { PagosComponent } from './pagos/pagos.component';
import { PendingComponent } from './pending/pending.component';

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
        MatCheckboxModule,
        MatButtonModule,
        MatInputModule,
        MatExpansionModule,
        MatSelectModule,
        MatDialogModule,
        MatSnackBarModule,
        StorageServiceModule,
        MatMenuModule,
        MatTableModule,
        MatStepperModule,
        AngularFireStorageModule,
        MatProgressSpinnerModule,
        MatCardModule
    ],
    declarations: [MainComponent,
        ConvocatoriasComponent,
        SedesComponent,
        TalleresComponent,
        CategoriasComponent,
        PatrocinadoresComponent,
        AvisosComponent,
        CorreosComponent,
        UsuariosComponent,
        UsuariosDetalleComponent,
        DocumentosComponent,
        AdministracionRolesComponent,
        PagosComponent,
        PendingComponent
    ],
    exports: [MainComponent]
})
export class AdminModule { }
