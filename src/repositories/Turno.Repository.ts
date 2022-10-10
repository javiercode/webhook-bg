import { DeleteResult, EntityRepository,  Like,  ObjectID,  UpdateResult } from "typeorm";
import { Turno } from "../entities/mongo/Turno";
import { TurnoDto, TurnoEditDto,  } from "../entities/dto/TurnoDto"
import { ListPaginate } from "../entities/dto/GeneralDto"
import { MongoDataSource } from "../configs/db";

const turnoRepository = MongoDataSource.getRepository(Turno);

export async function findByDto(params: TurnoDto): Promise<Turno | null> {
    let options = {};
    options = params
    const firstUser = await turnoRepository.findOneBy(options);
    return firstUser;
};

export async function findAll(limit:number, page:number): Promise<ListPaginate | null> {
    const take = limit ||10;
    const skip = page ||0;
    const [result, total] = await turnoRepository.findAndCount({
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

export async function findById(params: string): Promise<Turno | null> {
    const firstUser = await turnoRepository.findOneById(params);
    return firstUser;
};

export async function desactivar(userId: string): Promise<UpdateResult> {
    const firstUser = await turnoRepository.update(userId, { estado: 'D' });
    return firstUser;
};

export async function actualizar(userId: string, param: TurnoEditDto): Promise<UpdateResult> {
    const firstUser = await turnoRepository.update(userId, param);
    return firstUser;
};

export async function deleteUser(params: Turno): Promise<DeleteResult> {
    const firstUser = await turnoRepository.delete(new ObjectID(params.id.toHexString()));
    return firstUser;
};