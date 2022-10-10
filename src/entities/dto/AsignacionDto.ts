import {Imagen} from  '../mongo/Imagen'
import {Tarea} from  '../mongo/Tarea'

export interface AsignacionDto{
    responsable:string,
    fecha:Date,
    observacion:string,
    codTurno:string,
    _id?:string,
    usuarioRegistro?: string,
    sucursalRegistro?: number,
    estado?: string,
    fechaRegistro?: Date,
}

export interface AsignacionEditDto {
    responsable:string,
    fecha:Date,
    observacion:string,
    codTurno:string,
    usurioModificacion?:string
    sucursalModificacion?:number
    fechaModificacion?:Date 
}

export interface AsignacionFindDto {
    responsable:string,
    fecha:Date,
    observacion:number,
    codTurno:string,
}

export interface AsignacionForm {
    responsable:string,
    fecha:string,
    observacion:string,
    codTurno:string,
}

export const AsignacionRegex:AsignacionForm =  {
    responsable: "^[A-Z]{1,10}$",
    fecha: "^[0-9 :/]{19}$",
    observacion: "^[a-zA-Z0-9À-ÿ .,]{0,300}$",
    codTurno:"^[a-fA-F0-9]{20,50}$",
  };