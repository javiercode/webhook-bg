import {MessageResponse} from '../../entities/dto/GeneralDto';

export interface ITarea {
    listPorEstado: (limit: number, page: number,tipo:string,authSession:any) => Promise<any>;
    list: (limit: number, page: number,authSession:any) => Promise<any>;
    listTest: (limit: number, page: number,authSession:any) => Promise<any>;
    getUsuario: (usuario:string) => Promise<any>;
    create: (userDto: any,authSession:any) => Promise<any>;
    edit: (id:string,userDto: any,authSession:any)=> Promise<MessageResponse>;
    cambiarEstado(id: string,estado:string,authSession:any): Promise<MessageResponse>;
    desactivar: (id:string,authSession:any)=> Promise<MessageResponse>;
    controlPermisos(usuario: string, sucursal: number, authSession: any): Promise<MessageResponse>;
}