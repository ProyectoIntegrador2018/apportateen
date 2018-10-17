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


const routes: Routes = [
    { path: '', redirectTo: '/inicio', pathMatch: 'full' },
    { path: 'inicio', component: HomeComponent },
    { path: 'ingresar', component: EnrollmentComponent },
    {
        path: 'admin', component: MainComponent,
        children: [
            { path: '', redirectTo: 'inicio', pathMatch: 'full' },
            { path: 'convocatorias', component: ConvocatoriasComponent },
            { path: 'sedes', component: SedesComponent },
            { path: 'talleres', component: TalleresComponent },
            { path: 'categorias', component: CategoriasComponent },
            { path: 'patrocinadores', component: PatrocinadoresComponent },
            { path: 'inicio', component: AvisosComponent }
        ]
    },
    {
        path: 'usuario', component: MainUserComponent,
        children: [
            { path: 'inscripcion', component: InscripcionComponent },
        ]
    }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    declarations: [],
    exports: [RouterModule]
})

export class AppRoutingModule { }