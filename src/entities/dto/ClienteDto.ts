export interface ClienteDto {
    nombre: string,
    telefono1: string,
    telefono2: string,
    direccion: string,
    ci: string,
    extension: string,
    complemento: string,
    comentario: string,
    latitud: string,
    longitud: string,
    usuarioRegistro?: string,
    sucursalRegistro?: number,
}
export interface ClienteEditDto {
    nombre: string,
    telefono1: string,
    telefono2: string,
    direccion: string,
    extension: string,
    comentario: string,
    latitud: string,
    longitud: string,
    usurioModificacion?:string
    sucursalModificacion?:number
    fechaModificacion?:Date 
}

export interface ClienteFindDto {
    ci: string,
    extension: string,
    complemento: string,
    estado?: string
}

export interface clienteForm {
    nombre: string,
    telefono1: string,
    telefono2: string,
    direccion: string,
    ci: string,
    extension: string,
    complemento: string,
    comentario: string,
    latitud: string,
    longitud: string,
}

export const clienteRegex:clienteForm =  {
    nombre: "^[a-zA-Z ñÑ]{1,200}$",
    telefono1: "^[0-9 ()-]{1,15}$",
    telefono2: "^[0-9 ()-]{0,15}$",
    direccion: "^[a-zA-Z0-9 .:#ñÑ]{1,200}$",
    ci: "^[0-9]{1,10}$",
    complemento: "^[a-zA-Z0-9 ]{0,3}$",
    extension: "^[A-Z]{1,2}$",
    comentario: "^[\\w\\W\\d\\D\\t\\n]{0,300}$",
    latitud: "^[0-9 -.]{0,50}$",
    longitud: "^[0-9 -.]{0,50}$",
  };