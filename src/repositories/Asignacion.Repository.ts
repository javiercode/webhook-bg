import { DeleteResult, EntityRepository,  Like,  ObjectID,  UpdateResult } from "typeorm";
import { Asignacion } from "../entities/mongo/Asignacion";
import { AsignacionDto, AsignacionEditDto,  } from "../entities/dto/AsignacionDto"
import { ListPaginate } from "../entities/dto/GeneralDto"
import { MongoDataSource } from "../configs/db";

const asignacionRepository = MongoDataSource.getRepository(Asignacion);

export async function findByDto(params: AsignacionDto): Promise<Asignacion | null> {
    let options = {};
    options = params
    const firstUser = await asignacionRepository.findOneBy(options);
    return firstUser;
};

export async function findAll(limit:number, page:number): Promise<ListPaginate | null> {
    const take = limit ||10;
    const skip = page ||0;
    const [result, total] = await asignacionRepository.findAndCount({
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

export async function findById(params: string): Promise<Asignacion | null> {
    const firstUser = await asignacionRepository.findOneById(params);
    return firstUser;
};

export async function desactivar(userId: string): Promise<UpdateResult> {
    const firstUser = await asignacionRepository.update(userId, { estado: 'D' });
    return firstUser;
};

export async function actualizar(userId: string, param: AsignacionEditDto): Promise<UpdateResult> {
    const firstUser = await asignacionRepository.update(userId, param);
    return firstUser;
};

export async function deleteUser(params: Asignacion): Promise<DeleteResult> {
    const firstUser = await asignacionRepository.delete(new ObjectID(params.id.toHexString()));
    return firstUser;
};