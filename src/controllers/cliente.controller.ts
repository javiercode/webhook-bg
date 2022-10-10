import { Request, response, Response } from "express";
import { getAuthUser } from '../configs/TokenMiddleware';
import clienteService from '../services/Cliente.service';
import {ClienteDto, ClienteEditDto, clienteForm, clienteRegex} from '../entities/dto/ClienteDto';
import { getFecha, validateParams } from "../configs/General.functions";
import { TypeKeyParamEnum } from "../configs/Config.enum";
import { MessageResponse } from "../entities/dto/GeneralDto";

export async function test (req: Request, res:Response){
    // getFecha('27/7/2022 21:28:06');
    getFecha(new Date());
    getFecha(new Date());
    return res.status(501)
}

export async function listSucursal (req: Request, res:Response){
    const result = await clienteService.listSucursal(getAuthUser(req));
    return res.status(200).send(result);
}

export async function list (req: Request, res:Response){
    const {page,limit} =req.params;
    const resultPage = validateParams(page,TypeKeyParamEnum.PAGE)
    const resultLimit = validateParams(limit,TypeKeyParamEnum.LIMIT)
    let result;
    if(resultLimit.success && resultPage.success){
        result = await clienteService.list(parseInt(limit),parseInt(page));
    }else{
        result = resultLimit.success? resultPage: resultLimit;
    }
    return res.status(200).send(result);
}

export async function findNombre (req: Request, res:Response){
    const {param} =req.params;
    let result = validateParams(param,TypeKeyParamEnum.PARAM_BUSQUEDA)
    if(result.success){
        result = await clienteService.findNombre(param);
    }
    return res.status(200).send(result);
}

export async function findId (req: Request, res:Response){
    const {id} =req.params;
    const result = await clienteService.findOne(id);
    return res.status(200).send(result);
}

export async function create (req: Request, res:Response){
    const userDto = req.body as ClienteDto;
    let result = validate(toIFormValidateCreate(userDto));
    if(result.success){
        result = await clienteService.create(userDto,getAuthUser(req));
    }
    return res.status(200).send(result);
}

export async function edit (req: Request, res:Response){
    const userDto = req.body as ClienteEditDto;
    const resultPk = validateParams(req.params.id,TypeKeyParamEnum.OBJECT_ID)
    let result = validate(toIFormValidateEdit(userDto));

    if(result.success && resultPk.success){
        result = await clienteService.edit(req.params.id ,userDto,getAuthUser(req));
    }else{
        result = result.success? resultPk: result;
    }
    return res.status(200).send(result);
}

export async function desactivar (req: Request, res:Response){
    let result = validateParams(req.params.id,TypeKeyParamEnum.OBJECT_ID)
    if(result.success){
        result = await clienteService.desactivar(req.params.id,getAuthUser(req));
    }
    return res.status(200).send(result);
}

function validate(dataForm: clienteForm ): MessageResponse {
    let res: MessageResponse = { success: false, message: "Error de validación del(los) campo(s): ", code: 0 };
    try {
        let campoError = [] as string[];
        Object.keys(clienteRegex).forEach((key:string) => {
            const value = dataForm[key as keyof clienteForm];
            const regexValue = clienteRegex[key as keyof clienteForm] as any;
            let regex = new RegExp(regexValue);
            if (value && !regex.test(value.toString())) {
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


function toIFormValidateCreate(dataForm: ClienteDto  ): clienteForm {
    let res: clienteForm = { 
        nombre: dataForm.nombre,
        telefono1: dataForm.telefono1,
        telefono2: dataForm.telefono2,
        direccion: dataForm.direccion,
        ci: dataForm.ci,
        extension: dataForm.extension,
        complemento: dataForm.complemento,
        comentario: dataForm.comentario,
        latitud: dataForm.latitud,
        longitud: dataForm.longitud };    
    return res;
}
function toIFormValidateEdit(dataForm: ClienteEditDto ): clienteForm {
    let res: clienteForm = { 
        nombre: dataForm.nombre,
        telefono1: dataForm.telefono1,
        telefono2: dataForm.telefono2,
        direccion: dataForm.direccion,
        ci: "0000000",
        extension: dataForm.extension,
        complemento: "",
        comentario: dataForm.comentario,
        latitud: dataForm.latitud,
        longitud: dataForm.longitud }; 
    
    return res;
}