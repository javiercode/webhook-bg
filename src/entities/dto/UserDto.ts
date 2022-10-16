export interface createUserDto {
    codRolAplicacion: string,
    usuario: string,
    sucursal: number
}

export interface userDtoParcial {
    usuario: string,
    codRolAplicacion: string
}

export interface editUser {
    id: number,
    idRol: number,
    usuario: string,
    sucursal: number
}

export interface createUserDto {
    codRolAplicacion: string,
    usuario: string,
    sucursal: number
}

export interface createUserForm {
    codRolAplicacion: string,
    usuario: string,
    sucursal: string
}

export interface UserDto {
    username:string,
    correo:string,
    password:string
    codFacebook?:string,
    estado?:string,
}

export const createUserRegex: createUserForm = {
    codRolAplicacion: "^[0-9]{1,2}$",
    usuario: "^[a-zA-Z0-9]{3,4}$",
    sucursal: "^[0-9]{1,3}$",
  };