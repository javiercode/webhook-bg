import { DeleteResult, EntityRepository, In, Repository, UpdateResult } from "typeorm";
import { RolAplicacion } from "../entities/mongo/RolAplicacion";
import { createUserDto } from "../entities/dto/UserDto"
import { MongoDataSource } from "../configs/db";

const userRepository = MongoDataSource.getRepository(RolAplicacion);

export async function findAllRolesFindParams(): Promise<RolAplicacion[] | null>{    
    const rolAplicacions = await userRepository.find({
        select:['id','codigo','descripcion'],
        where: { estado: 'A' },
        order: {
            fechaRegistro: "ASC",
        }
    });
    return rolAplicacions;
};

export async function findAllRolesQueryBuilder (): Promise<RolAplicacion[] | null>{
    let rolAplicacions2 =null;
    try {
        rolAplicacions2 = await userRepository.createQueryBuilder("rol")
        .select("rol.codigo","codigo")
        .addSelect("rol.descripcion","descripcion")
        .addSelect("rol.identificador","identificador")
        .where("TZ_LOCK = 0 OR COD_APLICACION = :cod", { cod: 1 })
        .execute();  
    } catch (error) {
        console.error(error)
    }
    
    return rolAplicacions2;
};

export async function findAllRoles (): Promise<RolAplicacion[] | null>{
    const firstUser = await userRepository.find();
    return firstUser;
};

export async function findById (params: string): Promise<RolAplicacion | null>{    
    let options={}
    options = {
        where: {id:params}
    }
     const firstUser = await userRepository.findOne(options);
     return firstUser;
};

export async function findByINId (params: number[]): Promise<RolAplicacion[] >{  
    let options={}
    options = {
        where: {id:In(params)}
    }
     const firstUser = await userRepository.find(options);
     return firstUser;
};
 
