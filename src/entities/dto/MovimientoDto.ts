import {Imagen} from  '../mongo/Imagen'
import {Tarea} from  '../mongo/Tarea'

export interface MovimientoDto {
    tipo: string,
    latitud: string,
    longitud: string,
    codTarea:string,
    codImagen:string,
    tarea?:Tarea,
    imagen?:Imagen,
    _id?:string,
    usuarioRegistro?: string,
    sucursalRegistro?: number,
    estado?: string,
    fechaRegistro?: Date,
}

export interface MovimientoEditDto {
    tipo: string,
    latitud: string,
    longitud: string,
    codTarea:string,
    codImagen:string,
    imagen?:Imagen,
    usurioModificacion?:string
    sucursalModificacion?:number
    fechaModificacion?:Date 
}

export interface MovimientoFindDto {
    tipo: string,
    fecha: Date,
    latitud: string,
    longitud: string,
    codImagen:string,
    codTarea:string,
}

export interface MovimientoForm {
    tipo: string,
    latitud: string,
    longitud: string,
    codTarea:string,
    codImagen:string,
}

export const movimientoRegex:MovimientoForm =  {
    tipo: "^[A-Z]{1,10}$",
    latitud: "^[0-9 -]{0,50}$",
    longitud: "^[0-9 -]{0,50}$",
    codTarea:"^[a-fA-F0-9]{20,50}$",
    codImagen:"^[a-fA-F0-9]{20,50}$",
  };