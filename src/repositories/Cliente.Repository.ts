import { DeleteResult, EntityRepository,  Like,  ObjectID,  UpdateResult } from "typeorm";
import { Cliente } from "../entities/mongo/Cliente";
import { ClienteDto,ClienteEditDto,ClienteFindDto,  } from "../entities/dto/ClienteDto"
import { ListPaginate } from "../entities/dto/GeneralDto"
import { MongoDataSource } from "../configs/db";

const clientRepository = MongoDataSource.getRepository(Cliente);

export async function findByDto(params: ClienteFindDto): Promise<Cliente | null> {
    const firstUser = await clientRepository.findOneBy(params);
    return firstUser;
};

export async function findAll(limit:number, page:number): Promise<ListPaginate | null> {
    const take = limit ||10;
    const skip = page ||0;
    const [result, total] = await clientRepository.findAndCount({
        where: { estado: 'A' },
        take:take,
        skip:(skip * take),
        order: {
            fechaRegistro: "DESC",
        }
    });
    return {
        data: result,
        count: total
    }
};

// @EntityRepository(Cliente)
export async function findAllByNombre(params:string): Promise<Cliente[] | null> {
    let options = {};
    options = {
        ...options,
        where:{
            $or:[
                {ci: new RegExp(params.toString(), 'i'), estado: 'A'},
                {nombre: new RegExp(params.toString().toUpperCase(), 'i'), estado: 'A'}
            ]
        },
        take:10,
        order: {
            nombre: "DESC",
        }
    }
    // options = {
    //     ...options,
    //     order: {
    //         nombre: "DESC",
    //     }
    // }
    const result = await clientRepository.find(options);
    
    return result
};

export async function findById(params: string): Promise<Cliente | null> {
    const firstUser = await clientRepository.findOneById(params);
    return firstUser;
};

export async function findSucursal(params: number[]): Promise<Cliente[] | null> {
    let options = {};
    options = {
        ...options,
        where:{
            estado: 'A',
            sucursalRegistro: {$in: params},
        },
        order: {
            nombre: "DESC",
        }
    }

    const result = await clientRepository.find(options);
    

    // const firstUser = await clientRepository.findOneById(params);
    return result;
};

export async function desactivar(userId: string): Promise<UpdateResult> {
    const firstUser = await clientRepository.update(userId, { estado: 'D' });
    return firstUser;
};

export async function actualizar(userId: string, param: ClienteEditDto): Promise<UpdateResult> {
    const firstUser = await clientRepository.update(userId, param);
    return firstUser;
};

export async function deleteUser(params: Cliente): Promise<DeleteResult> {
    const firstUser = await clientRepository.delete(new ObjectID(params.id.toHexString()));
    return firstUser;
};