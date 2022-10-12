import { ITurno } from './interfaces/ITurno.interface';
import {MongoDataSource} from "../configs/db";
import {JwtPayload} from '../entities/dto/GeneralDto';
import { TurnoDto, TurnoEditDto, TurnoFindDto } from '../entities/dto/TurnoDto';
import { ListPaginate } from '../entities/dto/GeneralDto';
import { Turno } from '../entities/mongo/Turno';
import { findAll, actualizar,findById,findByDto,desactivar } from '../repositories/Turno.Repository';
import { MessageResponse} from '../entities/dto/GeneralDto'
import { getFecha } from '../configs/General.functions';

class TurnoService implements ITurno {

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

    async edit(id:string,turnoDto: TurnoEditDto,authSession:JwtPayload): Promise<MessageResponse> {
        const res:MessageResponse={success:false, message:"Error de registro", code:0};
        try {
            const userDtoFind = await findById(id) as Turno;
            const isActive = userDtoFind?.estado =='A' || false;
            if(!userDtoFind || !(isActive)){
                res.message = "Cliente no encontrado!";
            }else{
                res.success = true;
                res.message = "Cliente actualizado!";

                turnoDto.usurioModificacion = authSession.clave;
                turnoDto.sucursalModificacion = authSession.sucursal;
                turnoDto.fechaModificacion = getFecha(new Date());
                const oRolUsuario = await actualizar(id,turnoDto);
                res.data = turnoDto;
            }
        } catch (error) {
            if (error instanceof TypeError) {
                console.error(error);
            }
        }
        return res;
    }

    async create(clienteDto: TurnoDto,authSession:JwtPayload): Promise<MessageResponse> {
        const res:MessageResponse={success:false, message:"Error de registro", code:0};
        //try {
            clienteDto.sucursalRegistro = authSession.sucursal;
            clienteDto.usuarioRegistro = authSession.clave;
            const oTurno = new Turno(clienteDto);
            oTurno.fechaRegistro = getFecha(new Date())
            res.success = true;
            res.message = "Turno registrado";
            const oRolUsuario = await MongoDataSource.manager.save(oTurno);
            res.data = oRolUsuario;
        /*} catch (error) {
            if (error instanceof TypeError) {
                console.error(error);
            }
        }*/
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