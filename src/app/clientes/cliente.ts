import {Region} from './region';
import{Factura} from '../facturas/models/factura'


export class Cliente {
    id: number;
    nombre: string;
    apellido: string;
    createAt: string;
    email: string;
    foto: string;
    region: Region;
    facturas: Array<Factura> = [];


 
constructor(id: number, nombre: string, apellido: string, createAt: string, email: string ){
    this.id = id;
    this.nombre=nombre;
    this.apellido = apellido;
    this.createAt= createAt;
    this.email= email;
}
}
