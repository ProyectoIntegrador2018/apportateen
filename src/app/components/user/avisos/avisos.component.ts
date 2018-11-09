import { Component, Inject } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';

@Component({
    selector: 'avisos',
    templateUrl: './avisos.component.html',
    styleUrls: ['./avisos.component.scss']
})

export class AvisosUserComponent {
    avisos;
    loading;
    constructor(private api: ApiService,
        @Inject(LOCAL_STORAGE) private storage: WebStorageService) {
        this.avisos = [];
        this.loading = null;
    }

    ngOnInit() {
        this.cargarAvisos();
    }

    cargarAvisos() {
        let userStorage = this.storage.get('@user:data');
        this.api.getUserById(userStorage.id).subscribe(user => {
            this.storage.set('@user:data', user);
            this.api.getAvisosByTaller(user.idtaller).subscribe(result => {
                this.loading = false;
                this.avisos = result;
            })
        })
    }
}