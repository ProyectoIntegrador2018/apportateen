import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { EnrollmentComponent } from '../enrollment/enrollment-selector/enrollment-selector.component'
import { MainComponent } from '../admin/main/main.component';
import { ConvocatoriasComponent } from '../admin/convocatorias/convocatorias.component';
import { SedesComponent } from '../admin/sedes/sedes.component';

const routes: Routes = [
    { path: '', redirectTo: '/inicio', pathMatch: 'full' },
    { path: 'inicio', component: HomeComponent },
    { path: 'ingresar', component: EnrollmentComponent },
    {
        path: 'admin', component: MainComponent,
        children: [
            { path: 'convocatorias', component: ConvocatoriasComponent },
            { path: 'sedes', component: SedesComponent }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    declarations: [],
    exports: [RouterModule]
})

export class AppRoutingModule { }