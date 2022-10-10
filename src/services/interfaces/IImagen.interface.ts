import {MessageResponse} from '../../entities/dto/GeneralDto';

export interface IImagen {
    list: (limit: number, page: number) => Promise<any>;
    
    
    create: (imagenDto: any,authSession:any) => Promise<any>;
    desactivar: (id:string,authSession:any)=> Promise<MessageResponse>;
}