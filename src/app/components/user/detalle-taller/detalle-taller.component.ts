import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { Taller } from 'app/models/taller.model';
import { User } from 'app/models/user.model';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-detalle-taller',
  templateUrl: './detalle-taller.component.html',
  styleUrls: ['./detalle-taller.component.scss']
})
export class DetalleTallerComponent implements OnInit {

  idTaller;
  taller;
  costo;
  estatus;
  user: User = new User();

  constructor(private api: ApiService,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    private route: ActivatedRoute, ) {
    this.taller = Taller;
    this.estatus = null;
  }

  ngOnInit() {
    //obtener Id del taller
    this.route.paramMap.subscribe(params => {
      this.idTaller = +params.get('id');
    });
    this.cargarTaller();


    //datos del usuario para obtener el costo dependiendod el tipo de escuela
    this.user = this.storage.get('@user:data');

    window.scrollTo(0, 0);
  }

  cargarTaller() {
    this.api.getTaller(this.idTaller).subscribe(result => {
      this.taller = result[0][0];
      console.log(this.taller);
    })
  }

  costoTaller(): number {
    if (this.taller["sedeDesc"] == "UDEM" || this.taller["sedeDesc"] == "SOFTTEK") {
      return 0;
    } else {
      if (this.user.escuela_tipo == "Privada") {
        return 1700;
      } else {
        return 700;
      }
    }
  }

  inscripcion(taller: Taller) {

  }

}
