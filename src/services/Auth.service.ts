
import { IAuth } from './interfaces/IAuth.interface';
import { MongoDataSource } from "../configs/db";
import { JwtPayload } from '../entities/dto/GeneralDto';
import { MessageResponse,LoginResponce } from '../entities/dto/GeneralDto'
import UsersService from '../services/Usuario.service';
import axios from "axios";
import https from 'https';


class AuthService implements IAuth {

    async auth(username: string, password: string): Promise<MessageResponse> {
        let result: MessageResponse = {
            success: false,
            message: 'Error al iniciar sesión',
            code: 0,
        }
        try {
            const verifyUser = await this.verifyCredential(username, password);
            if(verifyUser.success){
                const usuarioXSucursal = await UsersService.getUsuario(username);
                if (usuarioXSucursal.length >= 1) {
                    result = {
                        success: true,
                        message: 'Sesion iniciada',
                        code: 0,
                        data: {
                            'NOMBRE': username,
                            'ROL_ID': 0,
                            'ROL_PRINCIPAL': "",
                            'SUCURSALES': [],
                            'SUCURSAL_PRINCIPAL': 0,
                        }
                    };
                } else {
                    result.message = "Usuario no encontrado";
                }
            }else{
                result.success = verifyUser.success
                result.message = verifyUser.message
            }
        } catch (error) {
            console.error(error);
        }
        return result;

    }

    async verifyCredential(username: string, password: string): Promise<LoginResponce> {
        let result: LoginResponce = {
            success: false,
            message: 'Error al validar la sesión',
            token: "",
        }
        try {
            if(process.env.API_MIDDLEWARE && process.env.API_MIDDLEWARE !=="" ){
                const url = process.env.API_MIDDLEWARE;
                const httpsAgent = new https.Agent({ rejectUnauthorized: false });
                const { data } = await axios.get<LoginResponce>(url, {
                    auth: {
                        username: username,
                        password: password
                    },
                    httpsAgent:httpsAgent
                });
                result.success = data.success
                result.message = data.message
                result.token = data.token
            }
        } catch (error:any) {
            console.error(error)
            if(error.response && error.response.status && error.response.status==401){
                // result.message = error.response.data.message
                result.message = "El usuario o contraseña es inválido"
            }
        }        
        return result;
    }
}

export default new AuthService();