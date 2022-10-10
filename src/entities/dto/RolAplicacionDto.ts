export interface RolAplicacionDto {
    codigo:string,
    descripcion:string,
    jerarquia:number,
    usuarioRegistro?: string,
    sucursalRegistro?: number,
}
export interface RolAplicacionEditDto {
    codigo:string,
    descripcion:string,
    jerarquia:number,
    usurioModificacion?:string
    sucursalModificacion?:number
    fechaModificacion?:Date 
}
