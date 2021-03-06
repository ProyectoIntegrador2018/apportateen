import { Tutor } from "./tutor.model";

export class User {
    id: string = '';
    nombre: string = '';
    apellido: string = '';
    correo: string = '';
    fecha_nacimiento: string = '';
    telefono: string = '';
    curp: string = '';
    sexo: string = ''; 
    isAdmin: boolean = false;
    idtaller: number = 0;
    idcategoria: number = 0;
    categoria: string = '';
    tutor_nombre: string = '';
    tutor_telefono: string = '';
    tutor_correo: string = '';
    escuela: string = '';
    escuela_tipo: string = '';
    escuela_grado: string = '';
    num_Edi: string = "";
    id_axtuser : string = "";
    num_conf_pago : string = "";
    documentos : number = 0;
    talleres : number [] = [];
}