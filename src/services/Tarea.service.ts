import { ITarea } from './interfaces/ITarea.interface';
import { MongoDataSource } from "../configs/db";
import { JwtPayload } from '../entities/dto/GeneralDto';
import { TareaDto, TareaEditDto, TareaEstadoDto, TareaFindDto } from '../entities/dto/TareaDto';
import { ListPaginate } from '../entities/dto/GeneralDto';
import { Tarea } from '../entities/mongo/Tarea';
import { findAll, findAllUser, findAllSucursal, actualizar, findById, findByDto, desactivar, findPersonalize, findAllEstado } from '../repositories/Tarea.Repository';
import { findById as findIdCliente } from '../repositories/Cliente.Repository';
import { MessageResponse } from '../entities/dto/GeneralDto'
import { existeUsuario } from '../repositories/RolUsuario.Repository';
import { controlJurisdiccion, esOficial } from '../configs/TokenMiddleware';
import { ObjectID } from 'mongodb';
import { getFecha } from '../configs/General.functions';
import { EstadoTareaEnum } from '../configs/Config.enum';

class TareaService implements ITarea {

    async listPorEstado(limit: number, page: number, tipo: string, authSession: JwtPayload): Promise<MessageResponse> {
        const res: MessageResponse = { success: false, message: "Error de obtencion de datos!", code: 0 };
        try {
            const query = (await findAllEstado(tipo,authSession.clave, limit, page));
            res.data = query?.data ||[];
            res.success = true;
            res.message = "Obtención exitosa";
            res.total = res.data?.count || 0;

        } catch (error) {
            console.error(error);
            // }
        }

        return res;
    }

    async list(limit: number, page: number, authSession: JwtPayload): Promise<MessageResponse> {
        const res: MessageResponse = { success: false, message: "Error de obtencion de datos!", code: 0 };
        try {
            const query = esOficial(authSession) ? await findAllUser(authSession.clave, limit, page) : await findAllSucursal(authSession.sucursal, limit, page);

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

    async listSucursales(limit: number, page: number): Promise<MessageResponse> {
        const res: MessageResponse = { success: false, message: "Error de obtencion de datos", code: 0 };
        try {
            const query = await MongoDataSource.manager.query(`
            SELECT NOMBRESUCURSAL, SUCURSAL, DIRECCION  FROM SUCURSALES s WHERE s.TZ_LOCK =0
                `);
            res.data = query;
            res.success = true;
            res.message = "Obtención exitosa";
            res.total = query?.length || 0;
        } catch (error) {
            if (error instanceof TypeError) {
                console.error(error);
            }
        }

        return res;
    }

    async getUsuario(usuario: string) {
        try {
            const query = await MongoDataSource.manager.query(`
            select sf.CLAVE, pru.SUCURSAL, u.NOMBRE, pra.CODIGO as ROL, pra.DESCRIPCION
                from USUARIOS u inner join SIG_FUNCIONARIOS sf
                on u.CLAVE = sf.CLAVE inner join PGL_ROL_USUARIO pru
                on pru.CLAVE = u.CLAVE inner join PGL_ROL_APLICACIONES pra
                on pra.IDENTIFICADOR = pru.COD_ROL_APLICACION inner join EAP_APLICACIONES_INTERNAS eai
                on eai.IDENTIFICADOR = pra.COD_APLICACION
                where sf.TZ_LOCK=0 and u.TZ_LOCK=0
                and pru.TZ_LOCK=0 and pra.TZ_LOCK=0 and eai.TZ_LOCK=0
                and u.CLAVE = '${usuario}'
            `);
            //`,["GSV"]);
            return query;
        } catch (error) {
            if (error instanceof TypeError) {
                console.error(error);
            }
            return []
        }
    }

    async edit(id: string, tareaDto: TareaEditDto, authSession: JwtPayload): Promise<MessageResponse> {
        let res: MessageResponse = { success: false, message: "Error de registro", code: 0 };
        try {
            const tareaDtoFind = await findById(id);
            const isActive = tareaDtoFind?.estado != EstadoTareaEnum.ELIMINADO || false;
            if (!tareaDtoFind || !isActive) {
                res.message = "Tarea no encontrada!";
            } else {
                const existeUser = await existeUsuario(tareaDtoFind.responsable);
                const cPermisos = await this.controlPermisos(tareaDto.responsable, tareaDtoFind.sucursalRegistro, authSession);
                if (cPermisos.success && existeUser) {
                    tareaDto.fecha = getFecha( tareaDto.fecha );
                    tareaDto.usurioModificacion = authSession.clave;
                    tareaDto.sucursalModificacion = authSession.sucursal;
                    tareaDto.fechaModificacion =getFecha(new Date() );
                    const oTarea = await actualizar(id, tareaDto);
                    res.success = true;
                    res.message = "Tarea actualizada!";
                    res.data = tareaDto;
                    
                } else {
                    res = cPermisos
                }
            }
        } catch (error) {
            if (error instanceof TypeError) {
                console.error(error);
            }
        }
        return res;
    }

    async create(tareaDto: TareaDto, authSession: JwtPayload): Promise<MessageResponse> {
        const res: MessageResponse = { success: false, message: "Error de registro", code: 0 };
        try {
            tareaDto.fecha = getFecha(tareaDto.fecha);
            tareaDto.sucursalRegistro = authSession.sucursal;
            tareaDto.usuarioRegistro = authSession.clave;
            tareaDto.fechaRegistro =getFecha(new Date() );
            tareaDto.estado = 'A';
            tareaDto.responsable = tareaDto.responsable.toLocaleUpperCase();
            const oTarea = new Tarea(tareaDto);
            const oCliente = await findIdCliente(tareaDto.codCliente);
            if (oCliente) {
                oTarea.cliente = oCliente;
                oTarea.codCliente = oCliente.id;
            }
            const taraFindPrev = { "tipo": tareaDto.tipo, "codCliente": tareaDto.codCliente, "fecha": tareaDto.fecha, "estado": "A" } as TareaFindDto;
            const oTareaFind = await findByDto(taraFindPrev);
            if (oTareaFind) {
                res.message = "Tarea anteriormente registrada!";
            } else {
                const existeUser = await existeUsuario(oTarea.responsable);
                const cPermisos = await this.controlPermisos(tareaDto.responsable, (existeUser?.sucursal || 0), authSession);
                if (existeUser && cPermisos.success) {
                    res.success = true;
                    res.message = "Tarea registrada";
                    const oRolUsuario = await MongoDataSource.manager.save(oTarea);
                    res.data = oRolUsuario;
                } else {
                    res.message = cPermisos.success? "El usuario no esta registrado, o no pertence a su sucursal!": cPermisos.message;
                }

            }
        } catch (error) {
            if (error instanceof TypeError) {
                console.error(error);
            }
        }
        return res;
    }

    async desactivar(idUser: string, authSession: JwtPayload): Promise<MessageResponse> {
        let res: MessageResponse = { success: false, message: "Error de eliminación", code: 0 };
        try {
            const userDtoFind = await findById(idUser);
            if (userDtoFind) {
                const cPermisos = await this.controlPermisos(userDtoFind.responsable, userDtoFind.sucursalRegistro, authSession);
                if (cPermisos.success) {
                    res.success = true;
                    res.message = "Tarea eliminada!";
                    // const oRolUsuario = desactivar(idUser);
                } else {
                    res = cPermisos;
                }
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

    async cambiarEstado(id: string, estado: string, authSession: JwtPayload): Promise<MessageResponse> {
        const res: MessageResponse = { success: false, message: "Error de registro", code: 0 };
        try {
            const tareaDtoFind = await findById(id);
            console.log("tareaDtoFind",tareaDtoFind)
            if (!tareaDtoFind ) {
                res.message = "Tarea no encontrada!";
            } else {
                res.success = true;
                res.message = "Tarea actualizada!";
                const tareaDto = {
                    estado: estado,
                    usurioModificacion: authSession.clave,
                    sucursalModificacion: authSession.sucursal,
                    fechaModificacion: getFecha(new Date())
                } as TareaEstadoDto;
                if(estado==EstadoTareaEnum.FINALIZADO){
                    tareaDto.fechaFinalizacion= getFecha(new Date());
                }
                const oTarea = await actualizar(id, tareaDto);
                res.data = tareaDto;
            }
        } catch (error) {
            if (error instanceof TypeError) {
                console.error(error);
            }
        }
        return res;
    }

    async listTest(limit: number, page: number, authSession: JwtPayload): Promise<MessageResponse> {
        const res: MessageResponse = { success: false, message: "Error de obtencion de datos!", code: 0 };
        try {
            // const query =findTest(limit,page);
            const query = await findPersonalize(limit, page, {
                estado: 'A',
                responsable: 'IRA',
            })

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

    async controlPermisos(usuario: string, sucursal: number, authSession: JwtPayload): Promise<MessageResponse> {
        let res: MessageResponse = { success: false, message: "No tiene permisos para proceder", code: 0 };
        try {
            const cJurisdiccion = await controlJurisdiccion(sucursal, authSession);
            res = cJurisdiccion;
            if(esOficial(authSession)){

                res.success = usuario == authSession.clave;
                res.message = !res.success? "El usuario no tiene permisos para proceder":res.message;
            }
            return res;
        } catch (error) {
            console.error(error);
        }

        return res;
    }

}

export default new TareaService();