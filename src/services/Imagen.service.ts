import { IImagen } from './interfaces/IImagen.interface';
import {MongoDataSource} from "../configs/db";
import {JwtPayload} from '../entities/dto/GeneralDto';
import { ImagenDto } from '../entities/dto/ImagenDto';
import { ListPaginate } from '../entities/dto/GeneralDto';
import { Cliente } from '../entities/mongo/Cliente';
import { findAll, actualizar,findById,findByDto,desactivar,findAllByNombre,findSucursal } from '../repositories/Cliente.Repository';
// import { findAll,findByDto } from '../repositories/Cliente.Repository';
import { MessageResponse} from '../entities/dto/GeneralDto'
import { Imagen } from '../entities/mongo/Imagen';

class ImagenService implements IImagen {

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


    async create(imagenDto: ImagenDto,authSession:JwtPayload): Promise<MessageResponse> {
        const res:MessageResponse={success:false, message:"Error de registro", code:0};
        try {
            imagenDto.sucursalRegistro = authSession.sucursal;
            imagenDto.usuarioRegistro = authSession.clave;
            imagenDto.fechaRegistro = new Date();
            const oImagen = new Imagen(imagenDto);
            res.success = true;
            res.message = "Cliente registrado";
            const imagen = await MongoDataSource.manager.save(oImagen);
            res.data = imagen;
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
                res.message = "Imagen eliminado";
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

export default new ImagenService();