import { IMovimiento } from './interfaces/IMovimiento.interface';
import {MongoDataSource} from "../configs/db";
import {JwtPayload} from '../entities/dto/GeneralDto';
import { MovimientoDto, MovimientoEditDto, MovimientoFindDto } from '../entities/dto/MovimientoDto';
import { ListPaginate } from '../entities/dto/GeneralDto';
import { MessageResponse} from '../entities/dto/GeneralDto'
import { findAll, findById,actualizar, findByDto, desactivar } from '../repositories/Movimiento.Repository';
import { Movimiento } from '../entities/mongo/Movimiento';
import { getFecha } from '../configs/General.functions';

class MovimientoService implements IMovimiento {

    async list(limit: number, page: number): Promise<MessageResponse> {
        const res:MessageResponse={success:false, message:"Error de obtencion de datos!", code:0};
        try {
            const query = await findAll(limit,page)
            res.data = query?.data;
            res.success = true;
            res.message = "Obtención exitosa";
            res.total = query?.count || 0;
        } catch (error) {
            // if (error instanceof TypeError) {
                console.error(error);
            // }
        }
        
        return res;
    }

    async findOne(param: string): Promise<MessageResponse> {
        const res:MessageResponse={success:false, message:"Error de obtencion de datos!", code:0};
        try {
            const query = await findById(param)
            res.data = query;
            res.success = true;
            res.message = "Obtención exitosa";
        } catch (error) {
            // if (error instanceof TypeError) {
                console.error(error);
            // }
        }
        
        return res;
    }

    async edit(id:string,movimientoDto: MovimientoEditDto,authSession:JwtPayload): Promise<MessageResponse> {
        const res:MessageResponse={success:false, message:"Error de registro", code:0};
        try {
            const userDtoFind = await findById(id) as Movimiento;
            const isActive = userDtoFind?.estado =='A' || false;
            if(!userDtoFind || !(isActive)){
                res.message = "Movimiento no encontrado!";
            }else{
                res.success = true;
                res.message = "Movimiento actualizado!";

                movimientoDto.usurioModificacion = authSession.clave;
                movimientoDto.sucursalModificacion = authSession.sucursal;
                movimientoDto.fechaModificacion = getFecha(new Date());
                const oRolUsuario = await actualizar(id,movimientoDto);
                res.data = movimientoDto;
            }
        } catch (error) {
            if (error instanceof TypeError) {
                console.error(error);
            }
        }
        return res;
    }

    async create(movimientoDto: MovimientoDto,authSession:JwtPayload): Promise<MessageResponse> {
        const res:MessageResponse={success:false, message:"Error de registro", code:0};
        try {
            movimientoDto.sucursalRegistro = authSession.sucursal;
            movimientoDto.usuarioRegistro = authSession.clave;
            const oMovimiento = new Movimiento(movimientoDto);
            oMovimiento.fechaRegistro = getFecha(new Date())
            const movimientoFind = {tipo: movimientoDto.tipo,
                latitud: movimientoDto.latitud,
                longitud: movimientoDto.longitud,
                codImagen:movimientoDto.codImagen,
                codTarea:movimientoDto.codTarea} as MovimientoFindDto;
            oMovimiento.estado='A';
            const userDtoFind = await findByDto(movimientoFind);
            if(userDtoFind){
                res.message = "Movimiento anteriormente registrado!";
            }else{
                    res.success = true;
                    res.message = "Movimiento registrado";
                    const oRolUsuario = await MongoDataSource.manager.save(oMovimiento);
                    res.data = oRolUsuario;
            }
        } catch (error) {
            if (error instanceof TypeError) {
                console.error(error);
            }
        }
        return res;
    }
    

    async desactivar(idUser: string,authSession:JwtPayload): Promise<MessageResponse> {
        const res:MessageResponse={success:false, message:"Error de eliminación", code:0};
        try {
            const userDtoFind = await findById(idUser);
            if(userDtoFind){
                res.success = true;
                res.message = "Movimiento eliminado";
                const oRolUsuario = desactivar(idUser);
                
            }else{
                res.message = "Movimiento no encontrado!";
                // res.data = oRolUsuario;
            }
        } catch (error) {
            if (error instanceof TypeError) {
                console.error(error);
            }
        }
        return res;
    }
    
}

export default new MovimientoService();