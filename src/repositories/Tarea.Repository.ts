import { DeleteResult, EntityRepository, UpdateResult, getMongoManager, ObjectID } from "typeorm";
import { Tarea } from "../entities/mongo/Tarea";
import { Cliente } from "../entities/mongo/Cliente";
import { TareaDto, TareaEditDto, TareaEstadoDto, TareaFindDto } from "../entities/dto/TareaDto"
import { ListPaginate } from "../entities/dto/GeneralDto"
import { MongoDataSource } from "../configs/db";
import { ObjectId } from "mongodb";
import { EstadoTareaEnum } from "../configs/Config.enum";
// import { ObjectId } from 'mongodb';

const tareaRepository = MongoDataSource.getRepository(Tarea);

export async function findByDto(params: TareaFindDto): Promise<Tarea | null> {

    let options = {};
    options = params

    const firstUser = await tareaRepository.findOneBy(options);
    return firstUser;
};

export async function findAll(): Promise<Tarea[] | null> {
    let options = {};
    options = {
        ...options,
        where: { estado: 'A'},
        order: {
            fechaRegistro: "DESC",
        }
    }

    const result= await tareaRepository.find(options);
    return result;
};

export async function findAllEstado(estado: string,user: string, limit: number, page: number): Promise<ListPaginate | null> {
    const oPaginate = await findPersonalize(limit,page,{
        estado: estado,
        responsable: user ,
    })
    return oPaginate
};

export async function findAllUser(user: string, limit: number, page: number): Promise<ListPaginate | null> {
    const oPaginate = await findPersonalize(limit,page,{
        estado: {$ne:'D'} ,
        responsable: user ,
    })
    return oPaginate
};

export async function findAllSucursal(sucursal: number, limit: number, page: number): Promise<ListPaginate | null> {
    const oPaginate = await findPersonalize(limit,page,{
        estado: {$ne:'D'} ,
        sucursalRegistro: sucursal ,
    })
    return oPaginate
};

export async function findPersonalize(limit: number, page: number, optionQuery: any): Promise<ListPaginate | null> {
    const take = limit || 10;
    const skip = page || 0;
    let aTarea = [] as Tarea[];
    let options = [];
    let optionsCount = optionQuery;
    options = [
        {
            "$lookup": {
                from: 'Cliente',
                foreignField: '_id',
                localField: 'codCliente',
                as: 'cliente',
            },
        },{
            "$match": optionQuery 
        },{
            "$skip": skip*take
        },{
            "$limit": take
        },
        {
            "$sort":{fechaRegistro: -1}
        }
    ]
    
    const total = await tareaRepository.count(optionsCount)
    const mongoManger = MongoDataSource.mongoManager;
    const result = await mongoManger.aggregate(Tarea, options).toArray();
    result.forEach((e) => {
        const oTarea = new Tarea(e);
        if(e.cliente.length>0){
            oTarea.cliente = e.cliente[0];
        }
        oTarea.codCliente = e.codCliente;
        oTarea.id = e._id;
        oTarea.usurioModificacion= e.usurioModificacion || oTarea.usurioModificacion;
        oTarea.sucursalModificacion= e.sucursalModificacion || oTarea.sucursalModificacion;
        oTarea.fechaModificacion= e.fechaModificacion || oTarea.fechaModificacion;
        aTarea.push(oTarea)
    })
    return {
        data: aTarea,
        count: total
    }
};

export async function findById(params: string): Promise<Tarea | null> {
    const findObj = await tareaRepository.findOneById(params);
    // const findObj4 = await tareaRepository.findOneById(new ObjectId(params).toHexString());
    
    // const findObj2 = await tareaRepository.find({
    //     where:{
    //         _id:new ObjectId(params).toHexString()
    //     }
    // });
    // const findObj3 = await tareaRepository.find({
    //     where:{
    //         _id:params
    //     }
    // });

    // let options = [];
    // options = [
    //     { $match: { 
    //         $expr : { 
    //             $eq: [ '$_id' , { $toObjectId: "61fc458b46d7874a3a97ef79" } ] 
    //         } 
    //     } }
    // ]
    
    // const mongoManger = MongoDataSource.mongoManager;
    // const result = await mongoManger.aggregate(Tarea, options).toArray();
    return findObj;
};

export async function desactivar(userId: string): Promise<UpdateResult> {
    const findObj = await tareaRepository.update(userId, { estado: 'D' });
    return findObj;
};

export async function actualizar(userId: string, param: TareaEditDto | TareaEstadoDto): Promise<UpdateResult> {
    const findObj = await tareaRepository.update(userId, param);
    return findObj;
};

export async function deleteUser(params: Tarea): Promise<DeleteResult> {
    const findObj = await tareaRepository.delete(new ObjectID(params.id.toHexString()));
    return findObj;
};