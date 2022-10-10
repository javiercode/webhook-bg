import {Cliente} from  '../mongo/Cliente'
export interface TareaDto {
    tipo:string,
    codCliente:string,
    responsable:string,
    fecha:Date,
    recordatorio:number,
    motivo:string,
    referencia:string,
    _id?:string,
    usuarioRegistro?: string,
    sucursalRegistro?: number,
    cliente?: Cliente,
    estado?: string,
    fechaRegistro?: Date,
}


export interface TareaEditDto {
    tipo:string,
    responsable:string,
    fecha:Date,
    recordatorio:number,
    motivo:string,
    referencia:string,
    usurioModificacion?:string,
    sucursalModificacion?:number,
    fechaModificacion?:Date 
}

export interface TareaEstadoDto {
    estado:string,
    usurioModificacion?:string,
    sucursalModificacion?:number,
    fechaModificacion?:Date,
    fechaFinalizacion?:Date,
}

export interface TareaFindDto {
    tipo:string,
    codCliente:string,
    fecha:Date,
    estado:string,
}


export interface TareaForm {
    tipo:string,
    codCliente:string,
    responsable:string,
    fecha:string,
    recordatorio:string,
    motivo:string,
    referencia:string,
}

export const tareaRegex:TareaForm =  {
    tipo: "^[A-Z_]{1,200}$",
    codCliente: "^[a-zA-Z0-9 ]{10,50}$",
    responsable: "^[a-zA-Z0-9]{3,4}$",
    fecha: "^[0-9 :/]{19}$",//TODO: aqui revisar, probar rest de tarea, jornada y movimiento
    recordatorio: "^[0-9]{1,10}$",
    motivo: "^[a-zA-Z0-9 .,]{0,300}$",
    referencia: "^[a-zA-Z0-9 .,]{0,300}$",
  };