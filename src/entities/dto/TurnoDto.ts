import {Imagen} from  '../mongo/Imagen'
import {Tarea} from  '../mongo/Tarea'

export interface TurnoDto {
    responsable:string,
    descripcion:string,
    turno:number,
    tipo:string,
    _id?:string,
    usuarioRegistro?: string,
    sucursalRegistro?: number,
    estado?: string,
    fechaRegistro?: Date,
}

export interface TurnoEditDto {
    responsable:string,
    descripcion:string,
    turno:number,
    tipo:string,
    usurioModificacion?:string
    sucursalModificacion?:number
    fechaModificacion?:Date 
}

export interface TurnoEditDto {
    responsable:string,
    descripcion:string,
    turno:number,
    tipo:string,
}

export interface TurnoForm {
    responsable:string,
    descripcion:string,
    turno:string,
    tipo:string,
}

export const turoRegex:TurnoForm =  {
    responsable: "^[a-zA-ZÀ-ÿ ]{1,200}$",
    descripcion: "^[a-zA-ZÀ-ÿ ]{1,300}$",
    turno: "^[0-9]{1,10}$",
    tipo:"^[a-zA-Z0-9]{0,50}$",
  };