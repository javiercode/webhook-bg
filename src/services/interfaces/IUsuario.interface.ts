import {MessageResponse} from '../../entities/dto/GeneralDto';

export interface IUsuario {
    test: (authSession:any) => Promise<any>;
    list: (limit: number, page: number,authSession:any) => Promise<any>;
    listSucursales: (limit: number, page: number) => Promise<any>;
    getUsuario: (usuario:string) => Promise<any>;
    create: (userDto: any,authSession:any) => Promise<any>;
    listRoles: () => Promise<any>;
    edit: (id:number,userDto: any,authSession:any)=> Promise<MessageResponse>;
}