import { DeleteResult, EntityRepository,  Like,  ObjectID,  UpdateResult } from "typeorm";
import { Imagen } from "../entities/mongo/Imagen";
import { ImagenDto } from "../entities/dto/ImagenDto"
import { ListPaginate } from "../entities/dto/GeneralDto"
import { MongoDataSource } from "../configs/db";

const imagenRepository = MongoDataSource.getRepository(Imagen);

export async function findByDto(params: ImagenDto): Promise<Imagen | null> {
    const firstUser = await imagenRepository.findOneBy(params);
    return firstUser;
};

export async function findAll(limit:number, page:number): Promise<ListPaginate | null> {
    const take = limit ||10;
    const skip = page ||0;
    const [result, total] = await imagenRepository.findAndCount({
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

export async function findById(params: string): Promise<Imagen | null> {
    const firstUser = await imagenRepository.findOneById(params);
    return firstUser;
};

export async function desactivar(userId: string): Promise<UpdateResult> {
    const firstUser = await imagenRepository.update(userId, { estado: 'D' });
    return firstUser;
};

export async function actualizar(userId: string, param: Imagen): Promise<UpdateResult> {
    const firstUser = await imagenRepository.update(userId, param);
    return firstUser;
};

export async function deleteUser(params: Imagen): Promise<DeleteResult> {
    const firstUser = await imagenRepository.delete(new ObjectID(params.id.toHexString()));
    return firstUser;
};