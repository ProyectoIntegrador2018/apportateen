import { Component, Inject } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { User } from 'app/models/user.model';
import { MatDialog } from '@angular/material';
import { InscripcionComponent } from '../inscripcion/inscripcion.component';
import {Router, Routes} from "@angular/router";
import { AvisoInscripcionTallerComponent } from './aviso-inscripcion-taller/aviso-inscripcion-taller.component';

@Component({
    selector: 'avisos',
    templateUrl: './avisos.component.html',
    styleUrls: ['./avisos.component.scss']
})

export class AvisosUserComponent {
    avisos;
    loading;
    user: User = new User();

    constructor(private api: ApiService,
        @Inject(LOCAL_STORAGE) private storage: WebStorageService,
        public dialog: MatDialog,
        private router : Router) {
        this.avisos = [];
        this.loading = null;
    }

    ngOnInit() {
        this.cargarAvisos();
        this.user = this.storage.get('@user:data');
    }

    ngAfterViewInit() {
        setTimeout(() => {
            if(this.user.idtaller !== 0) {
                this.cargarDialogoAvisoTaller();
            }
        });
    }
    cargarAvisos() {
        let userStorage = this.storage.get('@user:data');
        this.api.getAvisosForUser(userStorage.id).subscribe(result => {
            this.loading = false;
            this.avisos = result;
            console.log(this.avisos)
        })
    }

    cargarDialogoAvisoTaller() {
        let userStorage = this.storage.get('@user:data');
        // Revisar si usuario ha inscrito un taller, si no lo mandamos a que inscriba
        if (userStorage.idtaller !== 0) {
            // Si ya inscribio y no ha pagado hay que decirle que pague
            if (userStorage.num_conf_pago == null || userStorage.num_conf_pago === "") {
                let dialogDetalle = this.dialog.open(AvisoInscripcionTallerComponent, {
                width: '800px',
                data: {id : userStorage.id}
            }); 
        }
    } else {
        this.router.navigate(['usuario/inscripcion']);
    }
    }
}