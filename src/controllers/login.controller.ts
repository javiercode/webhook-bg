import { Request, response, Response } from "express";
import { getMongoRepository } from 'typeorm';
import { Tarea } from '../entities/mongo/Tarea';
import {MongoDataSource} from "../configs/db";
import jwt from 'jsonwebtoken';
import {encodeToken} from '../configs/TokenMiddleware'
import {MessageResponse} from '../entities/dto/GeneralDto';
import UsersService from '../services/Usuario.service';
import AuthService from '../services/Auth.service';
import {getDepartamento, TypeKeyParamEnum} from '../configs/Config.enum';
import { validateParams } from "../configs/General.functions";

export async function login (req: Request, res:Response){
    const {username, password} = req.body;
    let result = validateParams(username,TypeKeyParamEnum.USER)
    if(result.success){
        result = await AuthService.auth(username,password);
        if(result.success){
            res =  encodeToken(res, username, result.data.NOMBRE, result.data.ROL,result.data.ROL_ID, result.data.SUCURSALES,result.data.SUCURSAL_PRINCIPAL,result.data.DEPARTAMENTO);
        }
    }
    return res.status(200).send(result);
}

export function logout (req: Request, res:Response){
    res.send('Hola Logout')
}