import {MessageResponse} from '../../entities/dto/GeneralDto';

export interface IAsignacion {
    list: (limit: number, page: number) => Promise<any>;
    create: (userDto: any,authSession:any) => Promise<any>;
    edit: (id:string,userDto: any,authSession:any)=> Promise<MessageResponse>;
    desactivar: (id:string,authSession:any)=> Promise<MessageResponse>;
}