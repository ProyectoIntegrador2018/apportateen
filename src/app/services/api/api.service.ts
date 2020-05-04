import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { Sponsor } from '../../models/sponsor.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Tutor } from '../../models/tutor.model';
import { Sede } from '../../models/sede.model';
import { Aviso } from '../../models/aviso.model';
import { Taller } from '../../models/taller.model';
import { Categoria } from 'app/models/categoria.model';
import { Archivo } from 'app/models/archivo.model';
const API_URL = environment.apiUrl;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Basic YWRtaW46YWRtaW4tcGFzc3dvcmQ='
  }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  // API: GET /users
  public getAllUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(API_URL + '/users', httpOptions)
      .catch(this.handleError);
  }

  // API: GET /users/usuarios
  public getUsersUsuarios(): Observable<User[]> {
    return this.http
      .get<User[]>(API_URL + '/admins/usuarios', httpOptions)
      .catch(this.handleError);
  }

  // API: GET /users/admins
  public getUsersAdmn(): Observable<User[]> {
    return this.http
      .get<User[]>(API_URL + '/admins/administradores', httpOptions)
      .catch(this.handleError);
  }


  // API: GET /users/:id
  public getUserById(user_id: string): Observable<User> {
    return this.http
      .get<User>(`${API_URL}/users/${user_id}`, httpOptions)
      .catch(this.handleError);
  }

  // API: GET /users/:correo
  public getUserByEmail(user_email: string): Observable<User> {
    return this.http
      .get<User>(`${API_URL}/users/${user_email}`, httpOptions)
      .catch(this.handleError);
  }

  // API: POST /users
  public createUserTaller(user: User): Observable<any> {
    return this.http
      .post<any>(`${API_URL}/users`, user, httpOptions)
      .catch(this.handleError);
  }

  // API: PUT /users/:id TALLER
  public updateUser(user: User): Observable<any> {
    console.log("hola");
    console.log(user);
    return this.http
      .put<any>(`${API_URL}/users/${user.id}`, user, httpOptions)
      .catch(this.handleError);
  }

  //API: PUT /users/complete/:id
  public updateUserCompelte(user: User): Observable<any> {
    return this.http
      .put<any>(`${API_URL}/users/complete/${user.id}`, user, httpOptions)
      .catch(this.handleError);
  }

  //API: DELETE /sponsors/:id
  public removeUser(id: number): Observable<any> {
    return this.http
      .delete<any>(`${API_URL}/users/delete/${id}`, httpOptions)
      .catch(this.handleError);
  }

  //API: PUT /admin/add/:id
  public addAdmin(user: User): Observable<any> {
    return this.http
      .post<any>(`${API_URL}/admins/agregar`, user, httpOptions)
      .catch(this.handleError);
  }

  //API : DELETE /admins/delete/:id
  public deleteAdmin(id: string): Observable<any> {
    return this.http
      .delete<any>(`${API_URL}/admins/delete/${id}`, httpOptions)
      .catch(this.handleError);
  }

  // API: GET /sponsors
  public getAllSponsors(): Observable<Sponsor[]> {
    return this.http
      .get<Sponsor[]>(API_URL + '/sponsors', httpOptions)
      .catch(this.handleError);
  }

  // API: POST /sponsors
  public createSponsor(sponsor: Sponsor): Observable<any> {
    return this.http
      .post<any>(`${API_URL}/sponsors`, sponsor, httpOptions)
      .catch(this.handleError);
  }

  //API: DELETE /sponsors/:id
  public removeSponsor(id: number): Observable<any> {
    return this.http
      .delete<any>(`${API_URL}/sponsors/${id}`, httpOptions)
      .catch(this.handleError);
  }

  // API: GET /guardians/:id
  public getGuardianByChildId(user_id: string): Observable<Tutor> {
    return this.http
      .get<Tutor>(API_URL + '/guardians/' + user_id, httpOptions)
      .catch(this.handleError);
  }

  public createTutor(taller: Taller): Observable<any> {
    return this.http
      .post<any>(`${API_URL}/guardians`, taller, httpOptions)
      .catch(this.handleError);
  }

  public getTutor(taller: Taller): Observable<any> {
    return this.http
      .get<any>(API_URL + '/guardians/' + taller.tutor, httpOptions)
      .catch(this.handleError);
  }

  public updateTutor(taller: Taller): Observable<any> {
    return this.http
      .put<any>(API_URL + '/guardians/' + taller.tutor, taller, httpOptions)
      .catch(this.handleError);
  }

  // API: GET /sedes
  public getAllSedes(): Observable<Sede[]> {
    return this.http
      .get<Sede[]>(API_URL + '/sedes', httpOptions)
      .catch(this.handleError);
  }

  public createResponsable(sede: Sede): Observable<any> {
    return this.http
      .post<any>(`${API_URL}/responsable`, sede, httpOptions)
      .catch(this.handleError);
  }

  public getReponsable(sede: Sede): Observable<any> {
    return this.http
      .get<any>(API_URL + '/responsable/' + sede.correo_responsable, httpOptions)
      .catch(this.handleError);
  }



  // API: POST /sedes
  public createSede(sede: Sede): Observable<any> {
    return this.http
      .post<any>(`${API_URL}/sedes`, sede, httpOptions)
      .catch(this.handleError);
  }

  // API: PUT /sedes/:id
  public updateSede(sede: Sede): Observable<any> {
    return this.http
      .put<any>(`${API_URL}/sedes/${sede.id}`, sede, httpOptions)
      .catch(this.handleError);
  }

  //API: DELETE /sedes/:id
  public removeSede(id: number): Observable<any> {
    return this.http
      .delete<any>(`${API_URL}/sedes/${id}`, httpOptions)
      .catch(this.handleError);
  }

  // API: GET /avisos
  public getAllAvisos(): Observable<Aviso[]> {
    return this.http
      .get<Aviso[]>(API_URL + '/avisos', httpOptions)
      .catch(this.handleError);
  }

  // API: GET /avisos/:id
  public getAvisosByTaller(id: number): Observable<Aviso[]> {
    return this.http
      .get<Aviso[]>(`${API_URL}/avisos/${id}`, httpOptions)
      .catch(this.handleError);
  }

  // API: POST /avisos
  public createAviso(aviso: Aviso): Observable<any> {
    return this.http
      .post<any>(`${API_URL}/avisos`, aviso, httpOptions)
      .catch(this.handleError);
  }

  // API: PUT /avisos/:id
  public updateAviso(aviso: Aviso): Observable<any> {
    return this.http
      .put<any>(`${API_URL}/avisos/${aviso.id}`, aviso, httpOptions)
      .catch(this.handleError);
  }

  //API: DELETE /avisos/:id
  public removeAviso(id: number): Observable<any> {
    return this.http
      .delete<any>(`${API_URL}/avisos/${id}`, httpOptions)
      .catch(this.handleError);
  }

  //API: GET /talleres/costos
  public getCostos(): Observable<any> {
    return this.http
      .get<any>(`${API_URL}/talleres/costos`, httpOptions)
      .catch(this.handleError);
  }

  //API: PUT /talleres/costos
  public updateCostos(costos: any): Observable<any> {
    return this.http
      .put<any>(`${API_URL}/talleres/costos`, costos, httpOptions)
      .catch(this.handleError);
  }

  // API: GET /talleres
  public getAllTalleres(): Observable<Taller[]> {
    return this.http
      .get<Taller[]>(API_URL + '/talleres', httpOptions)
      .catch(this.handleError);
  }

  // API: POST /talleres
  public createTaller(taller: Taller): Observable<any> {
    return this.http
      .post<any>(`${API_URL}/talleres`, taller, httpOptions)
      .catch(this.handleError);
  }

  // API: PUT /talleres/:id
  public updateTaller(taller: Taller): Observable<any> {
    console.log(taller);
    return this.http
      .put<any>(`${API_URL}/talleres/${taller.id}`, taller, httpOptions)
      .catch(this.handleError);
  }

  //API: DELETE /talleres/:id
  public removeTaller(id: number): Observable<any> {
    return this.http
      .delete<any>(`${API_URL}/talleres/${id}`, httpOptions)
      .catch(this.handleError);
  }

  // API: POST /inscripciones
  public createInscripcion(inscripcion: any): Observable<any> {
    return this.http
      .post<any>(`${API_URL}/inscripciones`, inscripcion, httpOptions)
      .catch(this.handleError);
  }

  //API: DELETE /inscripciones
  public removeInscripcion(inscripcion: any): Observable<any> {
    return this.http
      .post<any>(`${API_URL}/inscripciones/delete`, inscripcion, httpOptions)
      .catch(this.handleError);
  }


  // API: GET /categorias
  public getAllCategorias(): Observable<Categoria[]> {
    return this.http
      .get<Categoria[]>(API_URL + '/categorias', httpOptions)
      .catch(this.handleError);
  }

  // API: POST /categorias
  public createCategoria(categoria: Categoria): Observable<any> {
    return this.http
      .post<any>(`${API_URL}/categorias`, categoria, httpOptions)
      .catch(this.handleError);
  }

  // API: PUT /categorias/:id
  public updateCategoria(categoria: Categoria): Observable<any> {
    return this.http
      .put<any>(`${API_URL}/categorias/${categoria.id}`, categoria, httpOptions)
      .catch(this.handleError);
  }

  //API: DELETE /categorias/:id
  public removeCategoria(id: number): Observable<any> {
    return this.http
      .delete<any>(`${API_URL}/categorias/${id}`, httpOptions)
      .catch(this.handleError);
  }

  // API: GET /convocatorias
  public getEstatusConvocatorias(): Observable<any> {
    return this.http
      .get<any>(`${API_URL}/convocatorias`, httpOptions)
      .catch(this.handleError);
  }

  // API: PUT /convocatorias  -> No id needed as there's only one instance
  public updateConvocatorias(cambio: any): Observable<any> {
    return this.http
      .put<any>(`${API_URL}/convocatorias`, cambio, httpOptions)
      .catch(this.handleError);
  }

  // API: GET /talleres/detalle/:id
  public getTaller(id: number): Observable<any[]> {
    return this.http
      .get<any[]>(`${API_URL}/talleres/detalle/${id}`, httpOptions)
      .catch(this.handleError);
  }

  // API: GET /talleres/:id
  public getCorreosByTallerId(id: number): Observable<any[]> {
    return this.http
      .get<any[]>(`${API_URL}/talleres/${id}`, httpOptions)
      .catch(this.handleError);
  }

  //API: POST /archivos
  public createArchivoAdmn(archivo: Archivo): Observable<any> {
    return this.http
      .post<any>(`${API_URL}/archivos`, archivo, httpOptions)
      .catch(this.handleError);
  }

  //API: GET /archivos
  public getAllArchivosAdmn(): Observable<any[]> {
    return this.http
      .get<any[]>(`${API_URL}/archivos`, httpOptions)
      .catch(this.handleError);
  }

  //API: GET /archivos/:id
  public getAllArchivosById(id: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${API_URL}/archivos/user/${id}`, httpOptions)
      .catch(this.handleError);
  }

  //API: GET /archivos/:id
  public getArchivosAdminByUser(id: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${API_URL}/archivos/admin/user_files/${id}`, httpOptions)
      .catch(this.handleError);
  }

  //API: DELETE /delete/:id
  public deleteArchivoAdmn(id: string): Observable<any> {
    return this.http
      .delete<any>(`${API_URL}/archivos/delete/${id}`, httpOptions)
      .catch(this.handleError);
  }

  private handleError(error: Response | any) {
    console.error('ApiService::handleError', error);
    return Observable.throw(error);
  }

  // API: PUT /sedes/:id
  public updateUsuarioNumConfPago(user: User): Observable<any> {
    return this.http
      .put<any>(`${API_URL}/users/pago/${user.id}`, user, httpOptions)
      .catch(this.handleError);
  }
}
