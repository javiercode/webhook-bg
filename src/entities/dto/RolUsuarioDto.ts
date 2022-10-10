export interface RolUsuarioDto {
    codRolAplicacion:string,
    usuario:string,
    sucursal:number,
    usuarioRegistro?: string,
    sucursalRegistro?: number,
}
export interface RolUsuarioEditDto {
    codRolAplicacion:string,
    usuario:string,
    sucursal:number,
    usurioModificacion?:string
    sucursalModificacion?:number
    fechaModificacion?:Date 
}
