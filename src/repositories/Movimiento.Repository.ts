import { DeleteResult, EntityRepository,  Like,  ObjectID,  UpdateResult } from "typeorm";
import { Movimiento } from "../entities/mongo/Movimiento";
import { MovimientoDto, MovimientoEditDto,  } from "../entities/dto/MovimientoDto"
import { ListPaginate } from "../entities/dto/GeneralDto"
import { MongoDataSource } from "../configs/db";

const movimientoRepository = MongoDataSource.getRepository(Movimiento);

export async function findByDto(params: MovimientoDto): Promise<Movimiento | null> {
    let options = {};
    options = params
    const firstUser = await movimientoRepository.findOneBy(options);
    return firstUser;
};

export async function findAll(limit:number, page:number): Promise<ListPaginate | null> {
    const take = limit ||10;
    const skip = page ||0;
    const [result, total] = await movimientoRepository.findAndCount({
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

export async function findById(params: string): Promise<Movimiento | null> {
    const firstUser = await movimientoRepository.findOneById(params);
    return firstUser;
};

export async function desactivar(userId: string): Promise<UpdateResult> {
    const firstUser = await movimientoRepository.update(userId, { estado: 'D' });
    return firstUser;
};

export async function actualizar(userId: string, param: MovimientoEditDto): Promise<UpdateResult> {
    const firstUser = await movimientoRepository.update(userId, param);
    return firstUser;
};

export async function deleteUser(params: Movimiento): Promise<DeleteResult> {
    const firstUser = await movimientoRepository.delete(new ObjectID(params.id.toHexString()));
    return firstUser;
};