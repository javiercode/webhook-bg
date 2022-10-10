import { IJornada } from './interfaces/IJornada.interface';
import { MongoDataSource } from "../configs/db";
import { JwtPayload } from '../entities/dto/GeneralDto';
import { JornadaDto } from '../entities/dto/JornadaDto';
import { ListPaginate } from '../entities/dto/GeneralDto';
import { Jornada } from '../entities/mongo/Jornada';
import { findAll, actualizar, findById, findByDto, desactivar, findMarcado } from '../repositories/Jornada.Repository';
import { findById as findTarea } from '../repositories/Tarea.Repository';
import { MessageResponse } from '../entities/dto/GeneralDto'
import { esOficial } from '../configs/TokenMiddleware';
import { ObjectID } from 'mongodb';
import { JornadaEnum } from '../configs/Config.enum';
import { getFecha } from '../configs/General.functions';

class JornadaService implements IJornada {

    async getEstado(authSession: JwtPayload): Promise<MessageResponse> {
        const res: MessageResponse = { success: false, message: "Error de obtencion de datos!", code: 0 };
        try {
            let jornadaDto = {} as JornadaDto;
            jornadaDto.usuarioRegistro = authSession.clave;
            jornadaDto.sucursalRegistro = authSession.sucursal;
            jornadaDto.fechaRegistro = getFecha(new Date());
            jornadaDto.tipo = JornadaEnum.INICIO;
            const oJornadaInicio = await findMarcado(jornadaDto);
            jornadaDto.tipo = JornadaEnum.FIN;
            const oJornadaFin = await findMarcado(jornadaDto);

            res.success = true;
            res.message = oJornadaInicio ? "Jornada Iniciada" : "Jornada no Iniciada";
            if (oJornadaFin) {
                res.message = "Jornada Cerrada";
            }

            res.data = {
                "inicio": oJornadaInicio? oJornadaInicio.fecha.toLocaleString():"",
                "fin": oJornadaFin? oJornadaFin.fecha.toLocaleString():"",
                "fecha": jornadaDto.fechaRegistro.toLocaleDateString()
            };
            res.message = res.message + ", de " + authSession.name;
            res.success = true;
        } catch (error) {
            // if (error instanceof TypeError) {
            console.error(error);
            // }
        }

        return res;
    }


    async edit(id: string, jornadaDto: JornadaDto, authSession: JwtPayload): Promise<MessageResponse> {
        const res: MessageResponse = { success: false, message: "Error de registro", code: 0 };
        try {
            //     const oCliente = new Cliente(clienteDto.nombre,clienteDto.telefono1,clienteDto.telefono2, clienteDto.direccion, clienteDto.ci, clienteDto.complemento, clienteDto.comentario ,authSession.clave,authSession.sucursal);
            const tareaDtoFind = await findById(id);
            if (!tareaDtoFind) {
                res.message = "Cliente no encontrado!";
            } else {
                res.success = true;
                res.message = "Cliente actualizado!";
                tareaDtoFind.fecha = getFecha(new Date());
                tareaDtoFind.latitud = jornadaDto.latitud;
                tareaDtoFind.longitud = jornadaDto.longitud;

                tareaDtoFind.usurioModificacion = authSession.clave;
                tareaDtoFind.sucursalModificacion = authSession.sucursal;
                tareaDtoFind.fechaModificacion = getFecha(new Date());
                const oTarea = await actualizar(id, tareaDtoFind);
                res.data = jornadaDto;
            }
        } catch (error) {
            if (error instanceof TypeError) {
                console.error(error);
            }
        }
        return res;
    }



    async desactivar(idUser: string, authSession: JwtPayload): Promise<MessageResponse> {
        const res: MessageResponse = { success: false, message: "Error de eliminación", code: 0 };
        try {
            const userDtoFind = await findById(idUser);
            if (userDtoFind) {
                res.success = true;
                res.message = "Tarea eliminado";
                const oRolUsuario = desactivar(idUser);

            } else {
                res.message = "Tarea no encontrado!";
            }
        } catch (error) {
            if (error instanceof TypeError) {
                console.error(error);
            }
        }
        return res;
    }

    async findById(param: string): Promise<MessageResponse> {
        const res: MessageResponse = { success: false, message: "Error de obtencion de datos!", code: 0 };
        // try {
        const query = await findById(param)
        res.data = query;
        res.success = true;
        res.message = "Obtención exitosa";
        // } catch (error) {
        //     // if (error instanceof TypeError) {
        //         console.error(error);
        //     // }
        // }

        return res;
    }


    async marcar(jornadaDto: JornadaDto, authSession: JwtPayload): Promise<MessageResponse> {
        const res: MessageResponse = { success: false, message: "Error de registro", code: 0 };
        try {
            jornadaDto.usuarioRegistro = authSession.clave;
            jornadaDto.sucursalRegistro = authSession.sucursal;
            jornadaDto.fechaRegistro = getFecha(new Date());
            const oJornada = new Jornada(jornadaDto);
            oJornada.fecha = getFecha(new Date());
            let oJornadaFind;
            if (jornadaDto.tipo !== JornadaEnum.SEGUIMIENTO) {
                oJornadaFind = await findMarcado(jornadaDto);
                switch (jornadaDto.tipo) {
                    case JornadaEnum.INICIO:
                        res.message = "Jornada ya iniciada!";
                        break;
                    case JornadaEnum.FIN:
                        res.message = "Jornada ya finalizada!";
                        break;
                }
            }

            res.success = true;
            oJornada.estado = "A"
            const oRolUsuario = await MongoDataSource.manager.save(oJornada);

            switch (jornadaDto.tipo) {
                case JornadaEnum.INICIO:
                    res.message = "Jornada iniciada!";
                    break;
                case JornadaEnum.FIN:
                    res.message = "Jornada finalizada!";
                    break;
                case JornadaEnum.SEGUIMIENTO:
                    res.message = "Jornada registrada!";
                    break;
            }
            res.data = oRolUsuario;
        } catch (error) {
            if (error instanceof TypeError) {
                console.error(error);
            }
        }
        return res;
    }

}

export default new JornadaService();