import { Taller } from "./taller.model";

export class Sede {
    id: number = 0;
    nombre: string = '';
    direccion: string = '';
    talleres: Taller[] = [];
}