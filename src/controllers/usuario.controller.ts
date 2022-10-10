import { Request, response, Response } from "express";
import { getAuthUser } from '../configs/TokenMiddleware';
import { Tarea } from '../entities/mongo/Tarea';
import { RolUsuario } from '../entities/mongo/RolUsuario';
import { MongoDataSource } from "../configs/db";
import jwt from 'jsonwebtoken';
import UsersService from '../services/Usuario.service';
import { createUserDto, createUserRegex } from '../entities/dto/UserDto';

import { MessageResponse } from "../entities/dto/GeneralDto";
import { TypeKeyParamEnum } from "../configs/Config.enum";
import { validateParams } from "../configs/General.functions";


export async function test(req: Request, res: Response) {
    const { page, limit } = req.params;
    const result = await UsersService.test(getAuthUser(req));
    // validateParams("20",TypeKeyParamEnum.PK_ORACLE)
    // validateParams("62e2ebb2b20fe65328149010",TypeKeyParamEnum.OBJECT_ID)
    // validateParams("54",TypeKeyParamEnum.LIMIT)
    return res.status(200).send(result);
}

export async function listUsuario(req: Request, res: Response) {
    const { page, limit } = req.params;
    const resultPage = validateParams(page,TypeKeyParamEnum.PAGE)
    const resultLimit = validateParams(limit,TypeKeyParamEnum.LIMIT)
    let result;
    if(resultLimit.success && resultPage.success){
        result = await UsersService.list(parseInt(limit), parseInt(page), getAuthUser(req));
    }else{
        result = resultLimit.success? resultPage: resultLimit;
    }
    return res.status(200).send(result);
}

export async function createRolUsuario(req: Request, res: Response) {
    const userDto = req.body as createUserDto;
    let result = validate(userDto);
    if(result.success){
        result = await UsersService.create(userDto, getAuthUser(req));
    }
    return res.status(200).send(result);
}

export async function editRolUsuario(req: Request, res: Response) {
    const userDto = req.body as createUserDto;
    const resultPk = validateParams(req.params.id,TypeKeyParamEnum.PK_ORACLE)
    
    let result = validate(userDto);
    if(result.success && resultPk.success){
        result = await UsersService.edit(parseInt(req.params.id), userDto, getAuthUser(req));
    }else{
        result = result.success? resultPk: result;
    }
    return res.status(200).send(result);
}

export async function deleteRolUsuario(req: Request, res: Response) {
    let result = validateParams(req.params.id,TypeKeyParamEnum.PK_ORACLE)
    if(result.success){
        result = await UsersService.desactivarUser(parseInt(req.params.id), getAuthUser(req));
    }
    return res.status(200).send(result);
}

export async function listRoles(req: Request, res: Response) {
    const result = await UsersService.listRoles();
    return res.status(200).send(result);
}

export async function sucursalList(req: Request, res: Response) {
    const result = await UsersService.listSucursales(100, 0);
    return res.status(200).send(result);
}

function validate(dataForm: createUserDto): MessageResponse {
    let res: MessageResponse = { success: false, message: "Error de validación del(los) campo(s): ", code: 0 };
    try {
        let campoError = [] as string[];
        Object.keys(createUserRegex).forEach((key:string) => {
            const value = dataForm[key as keyof createUserDto];
            const regexValue = createUserRegex[key as keyof createUserDto] as string;
            let regex = new RegExp(regexValue);
            if (!regex.test(value.toString())) {
                campoError.push(key);
            }
        });
        res.success = campoError.length==0;
        res.message = campoError.length > 0? (res.message + campoError.join(", ")):"Sin error";    
    } catch (error) {
        console.error(error)
    }
    
    return res;
}

