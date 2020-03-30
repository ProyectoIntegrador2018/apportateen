import { Component, OnInit, Inject} from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { Taller } from 'app/models/taller.model';
import { User } from 'app/models/user.model';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';

@Component({
  selector: 'app-detalle-taller',
  templateUrl: './detalle-taller.component.html',
  styleUrls: ['./detalle-taller.component.scss']
})
export class DetalleTallerComponent implements OnInit {

  talleres;
  estatus;
  user : User = new User();

  constructor(private api: ApiService,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,) {
    this.talleres = [];
    this.estatus = null;
  }

  ngOnInit() {
    this.cargarTalleres();
    this.user = this.storage.get('@user:data');
  }

  cargarTalleres() {
    this.api.getAllTalleres().subscribe(result => {
      this.talleres = result[0];
      console.log("TALLERES");
      console.log(this.talleres);
    })
  }

  inscripcion(taller: Taller){

  }

}
