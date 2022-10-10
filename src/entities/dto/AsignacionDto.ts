import {Imagen} from  '../mongo/Imagen'
import {Tarea} from  '../mongo/Tarea'

export interface TurnoDto {
    responsable:string,
    fecha:Date,
    observacion:number,
    codTurno:string,
    _id?:string,
    usuarioRegistro?: string,
    sucursalRegistro?: number,
    estado?: string,
    fechaRegistro?: Date,
}

export interface TurnoEditDto {
    responsable:string,
    fecha:Date,
    observacion:number,
    codTurno:string,
    usurioModificacion?:string
    sucursalModificacion?:number
    fechaModificacion?:Date 
}

export interface TurnoEditDto {
    responsable:string,
    fecha:Date,
    observacion:number,
    codTurno:string,
}

export interface MovimientoForm {
    responsable:string,
    fecha:string,
    observacion:string,
    codTurno:string,
}

export const movimientoRegex:MovimientoForm =  {
    responsable: "^[A-Z]{1,10}$",
    fecha: "^[0-9 :/]{19}$",
    observacion: "^[a-zA-Z0-9À-ÿ .,]{0,300}$",
    codTurno:"^[a-fA-F0-9]{20,50}$",
  };