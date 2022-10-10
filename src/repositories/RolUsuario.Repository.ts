import { DeleteResult, EntityRepository, Repository, UpdateResult } from "typeorm";
import { RolUsuario } from "../entities/mongo/RolUsuario";
import { createUserDto,userDtoParcial } from "../entities/dto/UserDto"
import {MongoDataSource} from "../configs/db";
import { ListPaginate } from "../entities/dto/GeneralDto"

const userRepository = MongoDataSource.getRepository(RolUsuario);

export async function findByDto (params: createUserDto): Promise<ListPaginate |null>{
    let options={}
    options={...params}
    const [result,total] = await userRepository.findAndCount(options);
    
    return {
        data: result,
        count: total
    }
};


export async function findById (params: number): Promise<RolUsuario | null>{    
    let options={}
    options={params}
    const result = await userRepository.findOne(options);
    
    return result
};
 
export async function desactivar (userId: number){    
// export async function desactivar (userId: number): Promise<UpdateResult>{    
    let options={}
    options={userId}
    const firstUser = await userRepository.update(options,{estado:'A'});
    return firstUser;
};
 
export async function actualizar (userId:number, param: createUserDto){    
// export async function actualizar (userId:number, param: createUserDto): Promise<UpdateResult>{
    let options={}
    options={userId}
    const firstUser = await userRepository.update(options,param);
    return firstUser;
};
 
export async function deleteUser (params: RolUsuario): Promise<DeleteResult>{
    let options={}
    options={params}
    const firstUser = await userRepository.delete(options);
    return firstUser;
};
 
export async function existeUsuario (params: string): Promise<RolUsuario|null>{    
    let options={}
    options={
        where:{user:params}}
    const result = await userRepository.findOne(options);

    return result
};


export async function listAll (limit:number, page:number): Promise<ListPaginate>{
    const [result,total] = await userRepository.findAndCount();
    
    return {
        data: result,
        count: total
    }
};

export async function listBySucursales (limit:number,page:number,params: string): Promise<ListPaginate>{    
    return {
        data: [],
        count: 0
    }
};
