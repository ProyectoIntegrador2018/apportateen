import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  // API: GET /api/users
  public getAllUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(API_URL + '/api/users')
      .catch(this.handleError);
  }

  // API: GET /api/users/:id
  public getUserById(user_id: string): Observable<User> {
    return this.http
      .get<User>(API_URL + '/api/users/' + user_id)
      .catch(this.handleError);
  }

  // API: POST /api/users
  public createUser(user: User): Observable<User> {
    console.log('api user', user)
    return this.http
      .post<User>(`${API_URL}/api/users?user_id=${user.user_id}&nombre=${user.nombre}&apellido=${user.apellido}correo=${user.correo}&fecha_nacimiento=${user.fecha_nacimiento}`, user)
      .catch(this.handleError);
  }

  // API: GET /api/sponsors
  public getAllSponsors(): Observable<User[]> {
    return this.http
      .get<User[]>(API_URL + '/api/sponsors')
      .catch(this.handleError);
  }

  // API: POST /api/sponsors
  public createSponsor(user: User): Observable<User> {
    console.log('api user', user)
    return this.http
      .post<User>(`${API_URL}/api/sponsors?nombre=${user.nombre}&correo=${user.correo}`, user)
      .catch(this.handleError);
  }



  private handleError(error: Response | any) {
    console.error('ApiService::handleError', error);
    return Observable.throw(error);
  }
}
