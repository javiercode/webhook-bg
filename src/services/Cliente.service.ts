import { ICliente } from './interfaces/ICliente.interface';
import {MongoDataSource} from "../configs/db";
import {JwtPayload} from '../entities/dto/GeneralDto';
import { ClienteDto, ClienteEditDto, ClienteFindDto } from '../entities/dto/ClienteDto';
import { ListPaginate } from '../entities/dto/GeneralDto';
import { Cliente } from '../entities/mongo/Cliente';
import { findAll, actualizar,findById,findByDto,desactivar,findAllByNombre,findSucursal } from '../repositories/Cliente.Repository';
// import { findAll,findByDto } from '../repositories/Cliente.Repository';
import { MessageResponse} from '../entities/dto/GeneralDto'
import { getFecha } from '../configs/General.functions';

class ClienteService implements ICliente {

    async listSucursal(authSession:JwtPayload): Promise<MessageResponse> {
        const res:MessageResponse={success:false, message:"Error de obtencion de datos!", code:0};
        try {
            const query = await findSucursal(authSession.aSucursal)
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

    async findNombre(param: string): Promise<MessageResponse> {
        const res:MessageResponse={success:false, message:"Error de obtencion de datos!", code:0};
        try {
            const query = await findAllByNombre(param)
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

    async listSucursales(limit: number, page: number): Promise<MessageResponse> {
        const res:MessageResponse={success:false, message:"Error de obtencion de datos", code:0};
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

    async edit(id:string,clienteDto: ClienteEditDto,authSession:JwtPayload): Promise<MessageResponse> {
        const res:MessageResponse={success:false, message:"Error de registro", code:0};
        try {
        //     const oCliente = new Cliente(clienteDto.nombre,clienteDto.telefono1,clienteDto.telefono2, clienteDto.direccion, clienteDto.ci, clienteDto.complemento, clienteDto.comentario ,authSession.clave,authSession.sucursal);
            const userDtoFind = await findById(id) as Cliente;
            const isActive = userDtoFind?.estado =='A' || false;
            if(!userDtoFind || !(isActive)){
                res.message = "Cliente no encontrado!";
            }else{
                res.success = true;
                res.message = "Cliente actualizado!";

                clienteDto.usurioModificacion = authSession.clave;
                clienteDto.sucursalModificacion = authSession.sucursal;
                clienteDto.fechaModificacion = getFecha(new Date());
                const oRolUsuario = await actualizar(id,clienteDto);
                res.data = clienteDto;
            }
        } catch (error) {
            if (error instanceof TypeError) {
                console.error(error);
            }
        }
        return res;
    }

    async create(clienteDto: ClienteDto,authSession:JwtPayload): Promise<MessageResponse> {
        const res:MessageResponse={success:false, message:"Error de registro", code:0};
        try {
            clienteDto.sucursalRegistro = authSession.sucursal;
            clienteDto.usuarioRegistro = authSession.clave;
            const oCliente = new Cliente(clienteDto);
            oCliente.fechaRegistro = getFecha(new Date())
            const clienteFindCi = {"ci":clienteDto.ci,  "complemento": clienteDto.complemento} as ClienteFindDto;
            clienteFindCi.estado='A';
            const userDtoFind = await findByDto(clienteFindCi);
            if(userDtoFind){
                res.message = "Cliente anteriormente registrado!";
            }else{
                    res.success = true;
                    res.message = "Cliente registrado";
                    const oRolUsuario = await MongoDataSource.manager.save(oCliente);
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

export default new ClienteService();