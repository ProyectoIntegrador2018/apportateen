import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { EnrollmentComponent } from '../enrollment/enrollment-selector/enrollment-selector.component'
import { MainComponent } from '../admin/main/main.component';
import { ConvocatoriasComponent } from '../admin/convocatorias/convocatorias.component';
import { SedesComponent } from '../admin/sedes/sedes.component';
import { MainUserComponent } from '../user/main-user/main-user.component';
import { InscripcionComponent } from '../user/inscripcion/inscripcion.component';
import { TalleresComponent } from '../admin/talleres/talleres.component';
import { CategoriasComponent } from '../admin/categorias/categorias.component';
import { PatrocinadoresComponent } from '../admin/patrocinadores/patrocinadores.component';
import { AvisosComponent } from '../admin/avisos/avisos.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AvisosUserComponent } from '../user/avisos/avisos.component';
import { CorreosComponent } from '../admin/correos/correos.component';
import { UsuariosComponent } from '../admin/usuarios/usuarios.component';
import { DetalleTallerComponent } from '../user/detalle-taller/detalle-taller.component';
import { DocumentosComponent } from '../admin/documentos/documentos.component';
import { DocumentosUsuarioComponent } from '../user/documentos-usuario/documentos-usuario.component';
import { AdministracionRolesComponent } from '../admin/administracion-roles/administracion-roles.component';
import { PagosComponent } from '../admin/pagos/pagos.component';


const routes: Routes = [
    { path: '', redirectTo: '/inicio', pathMatch: 'full' },
    { path: 'inicio', component: HomeComponent },
    {
        path: 'ingresar', component: EnrollmentComponent
    },
    {
        path: 'admin', component: MainComponent, canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: 'ADMIN',
                redirectTo: 'ingresar'
            }
        },
        children: [
            { path: '', redirectTo: 'inicio', pathMatch: 'full' },
            { path: 'convocatorias', component: ConvocatoriasComponent },
            { path: 'sedes', component: SedesComponent },
            { path: 'talleres', component: TalleresComponent },
            { path: 'categorias', component: CategoriasComponent },
            { path: 'patrocinadores', component: PatrocinadoresComponent },
            { path: 'inicio', component: AvisosComponent },
            { path: 'correos', component: CorreosComponent },
            { path: 'usuarios', component: UsuariosComponent },
            { path: 'documentos', component: DocumentosComponent},
            { path: 'admin-roles', component: AdministracionRolesComponent},
            { path: 'pagos', component: PagosComponent}
        ]
    },
    {
        path: 'usuario', component: MainUserComponent, canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: 'USER',
                redirectTo: 'ingresar'
            }
        },
        children: [
            { path: '', redirectTo: 'inicio', pathMatch: 'full' },
            { path: 'inicio', component: AvisosUserComponent },
            { path: 'inscripcion', component: InscripcionComponent },
            { path : 'documentos', component: DocumentosUsuarioComponent},
            { path : 'principal', component: HomeComponent},
            { path : 'detalleTaller', component: DetalleTallerComponent}
        ]
    }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    declarations: [],
    exports: [RouterModule]
})

export class AppRoutingModule { }
