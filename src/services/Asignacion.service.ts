import {MongoDataSource} from "../configs/db";
import {JwtPayload} from '../entities/dto/GeneralDto';
import { AsignacionDto, AsignacionEditDto, AsignacionFindDto } from '../entities/dto/AsignacionDto';
import { Asignacion } from '../entities/mongo/Asignacion';
import { findAll, actualizar,findById,findByDto,desactivar } from '../repositories/Asignacion.Repository';
import { MessageResponse} from '../entities/dto/GeneralDto'
import { getFecha } from '../configs/General.functions';
import { IAsignacion } from './interfaces/IAsignacion.interface';

class TurnoService implements IAsignacion {

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

    async edit(id:string,asignacionDto: AsignacionEditDto,authSession:JwtPayload): Promise<MessageResponse> {
        const res:MessageResponse={success:false, message:"Error de registro", code:0};
        try {
            const userDtoFind = await findById(id) as Asignacion;
            const isActive = userDtoFind?.estado =='A' || false;
            if(!userDtoFind || !(isActive)){
                res.message = "Cliente no encontrado!";
            }else{
                res.success = true;
                res.message = "Cliente actualizado!";

                asignacionDto.usurioModificacion = authSession.clave;
                asignacionDto.sucursalModificacion = authSession.sucursal;
                asignacionDto.fechaModificacion = getFecha(new Date());
                const oRolUsuario = await actualizar(id,asignacionDto);
                res.data = asignacionDto;
            }
        } catch (error) {
            if (error instanceof TypeError) {
                console.error(error);
            }
        }
        return res;
    }

    async create(clienteDto: AsignacionDto,authSession:JwtPayload): Promise<MessageResponse> {
        const res:MessageResponse={success:false, message:"Error de registro", code:0};
        try {
            clienteDto.sucursalRegistro = authSession.sucursal;
            clienteDto.usuarioRegistro = authSession.clave;
            const oCliente = new Asignacion(clienteDto);
            oCliente.fechaRegistro = getFecha(new Date())
                    res.success = true;
                    res.message = "Asignacion registrada";
                    const oRolUsuario = await MongoDataSource.manager.save(oCliente);
                    res.data = oRolUsuario;
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
                res.message = "Cliente eliminado";
                const oRolUsuario = desactivar(idUser);
                
            }else{
                res.message = "Cliente no encontrado!";
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

export default new TurnoService();