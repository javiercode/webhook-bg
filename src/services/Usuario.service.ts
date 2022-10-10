import { IUsuario } from './interfaces/IUsuario.interface';
import { MongoDataSource } from "../configs/db";
import { JwtPayload } from '../entities/dto/GeneralDto';
import { createUserDto } from '../entities/dto/UserDto';
import { RolUsuario } from '../entities/mongo/RolUsuario';
import { findByDto, deleteUser, findById, actualizar, existeUsuario, listAll, listBySucursales,desactivar } from '../repositories/RolUsuario.Repository';
import { findById as findIdRol, findByINId } from '../repositories/RolAplicacion.Repository';
import { findAllRoles } from '../repositories/RolAplicacion.Repository';
import { MessageResponse } from '../entities/dto/GeneralDto'
import { esAdmin, esOficial, esJefe, esGerente, controlPermisos } from '../configs/TokenMiddleware';
import { RolesTypeEnum } from '../configs/Config.enum';


class UsersService implements IUsuario {

    async test(authSession: JwtPayload): Promise<MessageResponse> {
        const res: MessageResponse = { success: false, message: "Error de obtencion de datos!", code: 0 };
        // const result = await this.controlJerarquia(4, authSession);
        // const result2 = await this.controlJurisdiccion(101, authSession);
        return res;
    }

    async listRoles(): Promise<MessageResponse> {
        const res: MessageResponse = { success: false, message: "Error de obtencion de datos!", code: 0 };
        try {
            const query = await findAllRoles()
            res.data = query;
            res.success = true;
            res.message = "Obtención exitosa";
            res.total = query?.length || 0;
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
            res.data = [];
            res.success = true;
            res.message = "Obtención exitosa";
            res.total = 0;
        } catch (error) {
            if (error instanceof TypeError) {
                console.error(error);
            }
        }

        return res;
    }

    async list(limit: number, page: number, authSession: JwtPayload): Promise<MessageResponse> {
        const res: MessageResponse = { success: false, message: "Error de obtencion de datos", code: 0 };
        try {
            let query;
            if (esAdmin(authSession)) {
                query = await listAll(limit, page);
            } else {
                const strSucursal = authSession.aSucursal.join(",");
                query = await listBySucursales(limit, page, strSucursal);
            }
            res.data = query.data;
            res.success = true;
            res.message = "Obtención exitosa";
            res.total = query.count || 0;
        } catch (error) {
            if (error instanceof TypeError) {
                console.error(error);
            }
        }

        return res;
    }

    async getUsuario(usuario: string) {
        try {
            const query = usuario;
            //`,["GSV"]);
            return query;
        } catch (error) {
            if (error instanceof TypeError) {
                console.error(error);
            }
            return []
        }

    }

    async edit(id: number, userDto: createUserDto, authSession: JwtPayload): Promise<MessageResponse> {
        const res: MessageResponse = { success: false, message: "Error de registro", code: 0 };
        try {
            const rolUsuario = new RolUsuario();
            rolUsuario.usuario = userDto.usuario;
            rolUsuario.codRolAplicacion = userDto.codRolAplicacion;
            rolUsuario.sucursal = userDto.sucursal;
            const userDtoFind = await findById(id);

            const permisos = await controlPermisos(userDto.sucursal, userDto.codRolAplicacion, authSession);
            if (userDtoFind && permisos.success) {
                res.success = true;
                res.message = "rol actualizado!";
                await actualizar(id, userDto);
                res.data = userDto;
            } else {
                res.message = permisos.success? "Rol no encontrado": permisos.message;
            }
        } catch (error) {
            if (error instanceof TypeError) {
                console.error(error);
            }
        }
        return res;
    }

    async create(userDto: createUserDto, authSession: JwtPayload): Promise<MessageResponse> {
        const res: MessageResponse = { success: false, message: "Error de registro", code: 0 };
        try {
            const rolUsuario = new RolUsuario();
            rolUsuario.usuario = userDto.usuario;
            rolUsuario.codRolAplicacion = userDto.codRolAplicacion;
            rolUsuario.sucursal = userDto.sucursal;

                const existeUser = await existeUsuario(userDto.usuario);
                const permisos = await controlPermisos(userDto.sucursal, userDto.codRolAplicacion, authSession);
                if (existeUser && permisos.success) {
                    res.success = true;
                    res.message = "Rol registrado";
                    const oRolUsuario = await MongoDataSource.manager.save(rolUsuario);
                    res.data = oRolUsuario;
                } else {
                    res.message = permisos.success ? "El usuario no existe, no pertence a banca Mype o esta inhabilitado!" : permisos.message
                }
        } catch (error) {
            if (error instanceof TypeError) {
                console.error(error);
            }
        }
        return res;
    }

    async desactivarUser(idUser: number, authSession: JwtPayload): Promise<MessageResponse> {
        const res: MessageResponse = { success: false, message: "Error de eliminación", code: 0 };
        try {
            const userDtoFind = await findById(idUser);
            if (userDtoFind) {
                const permisos = await controlPermisos(userDtoFind.sucursal, userDtoFind.codRolAplicacion, authSession);
                if(permisos.success){
                    res.success = true;
                    res.message = "rol eliminado";
                    await desactivar(idUser);
                }else{
                    res.message = permisos.message;
                }

            } else {
                res.message = "rol no encontrado!";
            }
        } catch (error) {
            if (error instanceof TypeError) {
                console.error(error);
            }
        }
        return res;
    }

    
}

export default new UsersService();