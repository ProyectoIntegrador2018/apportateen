import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';
import { Taller } from 'app/models/taller.model';
import { User } from 'app/models/user.model';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-taller',
  templateUrl: './detalle-taller.component.html',
  styleUrls: ['./detalle-taller.component.scss']
})
export class DetalleTallerComponent implements OnInit {

  idTaller;
  taller;
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
    this.user = this.storage.get('@user:data');

  }

  cargarTaller(){
    this.api.getTaller(this.idTaller).subscribe(result => {
      console.log("taller");
      console.log(result);
      this.taller = result[0][0];
    })
  }

  inscripcion(taller: Taller) {

  }

}
