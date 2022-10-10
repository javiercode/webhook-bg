import {MessageResponse} from '../../entities/dto/GeneralDto';

export interface IJornada {
    getEstado: (authSession:any) => Promise<any>;
    marcar: (userDto: any,authSession:any) => Promise<any>;
    edit: (id:string,userDto: any,authSession:any)=> Promise<MessageResponse>;
    desactivar: (id:string,authSession:any)=> Promise<MessageResponse>;
    findById: (id:string)=> Promise<MessageResponse>;
}