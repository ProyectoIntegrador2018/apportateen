import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/services/api/api.service';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss']
})
export class PagosComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'NumConfPago'];

  users: any;


  constructor(private api: ApiService) {
    this.users = [];
   }

  ngOnInit() {
    this.fetchDB();
  }

  fetchDB() {
    this.api.getUsersUsuarios().subscribe(result => {
      this.users = result;
      console.log(this.users.length);
    });
  }

}
