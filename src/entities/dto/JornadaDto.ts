export interface JornadaDto {
    tipo:string,
    latitud:number,
    longitud:number,
    estado?: string,
    fechaRegistro:Date,
    usuarioRegistro:string,
    sucursalRegistro:number
}

export interface JornadaEditDto {
    fecha:string,
    tipo:string,
    latitud:number,
    longitud:number,
    estado?: string,
    usurioModificacion?:string,
    sucursalModificacion?:number,
    fechaModificacion?:Date 
}

export interface JorandaForm {
    tipo:string,
    latitud:string,
    longitud:string,
}

export const jornadaRegex:JorandaForm =  {
    tipo: "^[A-Z]{1,10}$",
    latitud: "^[0-9 -.]{4,50}$",
    longitud: "^[0-9 -.]{0,50}$",
  };