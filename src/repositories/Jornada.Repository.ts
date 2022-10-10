import { DeleteResult, EntityRepository, Like, UpdateResult, ObjectID as ObjectIDT } from "typeorm";
import { Jornada } from "../entities/mongo/Jornada";
import { Tarea } from "../entities/mongo/Tarea";
import { JornadaDto } from "../entities/dto/JornadaDto"
import { ListPaginate } from "../entities/dto/GeneralDto"
import { MongoDataSource } from "../configs/db";
import { ObjectId, ObjectID } from "mongodb";
import { JornadaEnum } from "../configs/Config.enum";
import { getFecha } from "../configs/General.functions";

const jornadaRepository = MongoDataSource.getRepository(Jornada);

export async function findByDto(params: JornadaDto): Promise<Jornada | null> {
    let options = {};
    options = params;
    const firstUser = await jornadaRepository.findOneBy(options);
    return firstUser;
};

export async function findMarcado(params: JornadaDto): Promise<Jornada | null> {
    let options = {};
    var startDate = getFecha(new Date());
    startDate.setHours(0, 0, 0, 0);

    var endDate = getFecha(new Date());
    endDate.setHours(23, 59, 59, 999);
    if(params.tipo === JornadaEnum.SEGUIMIENTO){
        options = {
            where: {
                fechaRegistro: {
                    $gte: new Date(startDate),
                    $lt: new Date(endDate),
                },
                estado: 'A',
                usuarioRegistro: params.usuarioRegistro,
            },
        }
    }else{
        options = {
            where: {
                fechaRegistro: {
                    $gte: new Date(startDate),
                    $lt: new Date(endDate),
                },
                estado: 'A',
                usuarioRegistro: params.usuarioRegistro,
                tipo: params.tipo,
            },
        }
    }
    const firstUser = await jornadaRepository.findOneBy(options);
    return firstUser;
};

export async function findAll(limit: number, page: number): Promise<ListPaginate | null> {
    const take = limit || 10;
    const skip = page || 0;
    const [result, total] = await jornadaRepository.findAndCount({
        where: { estado: 'A' },
        take: take,
        skip: (skip * take),
        order: {
            fechaRegistro: "DESC",
        }
    });
    return {
        data: result,
        count: total
    }
};

export async function findById(params: string): Promise<Jornada | null> {
    let options = {};
    options = {
        where: {
            _id: params
        }
    }
    let oJornada = await jornadaRepository.findOneById(params);
    return oJornada;
};

export async function desactivar(userId: string): Promise<UpdateResult> {
    const firstUser = await jornadaRepository.update(userId, { estado: 'D' });
    return firstUser;
};

export async function actualizar(userId: string, param: Jornada): Promise<UpdateResult> {
    const firstUser = await jornadaRepository.update(userId, param);
    return firstUser;
};

export async function deleteUser(params: string): Promise<DeleteResult> {
    const firstUser = await jornadaRepository.delete(new ObjectIDT(params));
    return firstUser;
};