import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { Sponsor } from '../../models/sponsor.model';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Tutor } from '../../models/tutor.model';
import { Sede } from '../../models/sede.model';
const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  // API: GET /users
  public getAllUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(API_URL + '/users')
      .catch(this.handleError);
  }

  // API: GET /users/:id
  public getUserById(user_id: string): Observable<User> {
    return this.http
      .get<User>(API_URL + '/users/' + user_id)
      .catch(this.handleError);
  }

  // API: POST /users
  public createUser(user: User): Observable<User> {
    return this.http
      .post<User>(`${API_URL}/users`, user)
      .catch(this.handleError);
  }

  // API: GET /sponsors
  public getAllSponsors(): Observable<Sponsor[]> {
    return this.http
      .get<Sponsor[]>(API_URL + '/sponsors')
      .catch(this.handleError);
  }

  // API: POST /sponsors
  public createSponsor(sponsor: Sponsor): Observable<Sponsor> {
    return this.http
      .post<Sponsor>(`${API_URL}/sponsors`, sponsor)
      .catch(this.handleError);
  }

  // API: GET /guardians/:id
  public getGuardianByChildId(user_id: string): Observable<Tutor> {
    return this.http
      .get<Tutor>(API_URL + '/guardians/' + user_id)
      .catch(this.handleError);
  }

  // API: GET /sedes
  public getAllSedes(): Observable<Sede[]> {
    return this.http
      .get<Sede[]>(API_URL + '/sedes')
      .catch(this.handleError);
  }


  // API: POST /sedes
  public createSede(sede: Sede): Observable<Sede> {
    return this.http
      .post<Sede>(`${API_URL}/sedes`, sede)
      .catch(this.handleError);
  }

  // API: PUT /sedes/:id
  public updateSede(sede: Sede): Observable<Sede> {
    return this.http
      .put<Sede>(`${API_URL}/sedes/${sede.id}`, sede)
      .catch(this.handleError);
  }

  //API: DELETE /sedes/:id
  public removeSede(id: number): Observable<Sede> {
    return this.http
      .delete<Sede>(`${API_URL}/sedes/${id}`)
      .catch(this.handleError);
  }

  private handleError(error: Response | any) {
    console.error('ApiService::handleError', error);
    return Observable.throw(error);
  }
}
