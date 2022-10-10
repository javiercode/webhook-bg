import { Request, response, Response } from "express";
import { getAuthUser } from '../configs/TokenMiddleware';
import movimientoService from '../services/Movimiento.service';
import {MovimientoDto, MovimientoEditDto, MovimientoForm, movimientoRegex} from '../entities/dto/MovimientoDto';
import { MessageResponse } from "../entities/dto/GeneralDto";
import { validateParams } from "../configs/General.functions";
import { TypeKeyParamEnum } from "../configs/Config.enum";

export async function test (req: Request, res:Response){
    res.status(501)
}

export async function list (req: Request, res:Response){
    const {page,limit} =req.params;
    const resultPage = validateParams(page,TypeKeyParamEnum.PAGE)
    const resultLimit = validateParams(limit,TypeKeyParamEnum.LIMIT)
    let result;
    if(resultLimit.success && resultPage.success){
        result =await movimientoService.list(parseInt(limit),parseInt(page));
    }else{
        result = resultLimit.success? resultPage: resultLimit;
    }
    return res.status(200).send(result);
}

export async function findId (req: Request, res:Response){
    const {id} =req.params;
    let result = validateParams(req.params.id,TypeKeyParamEnum.OBJECT_ID)
    if(result.success){
        result = await movimientoService.findOne(id);
    }
    return res.status(200).send(result);
}

export async function upload (req: Request, res:Response){
    // res.setHeader('Content-Type', 'multipart/form-data');
    // const userDto = req.body as MovimientoDto;
    // let result = validate(userDto);
    console.log("req.body",req.body);
    console.log("req.file",req.file);
    console.log("req.files",req.files);
    // if(result.success){
        // result = await movimientoService.create(userDto,getAuthUser(req));
    // }
    const data ={
        body:req.body,
        file:req.file,
        files:req.files,
    }
    return res.status(200).send(data);
}

export async function edit (req: Request, res:Response){
    const userDto = req.body as MovimientoEditDto;
    const result = await movimientoService.edit(req.params.id ,userDto,getAuthUser(req));
    return res.status(200).send(result);
}

export async function desactivar (req: Request, res:Response){
    let result = validateParams(req.params.id,TypeKeyParamEnum.OBJECT_ID)
    if(result.success){
        result = await movimientoService.desactivar(req.params.id,getAuthUser(req));
    }
    return res.status(200).send(result);
}

function validate(dataForm: MovimientoForm ): MessageResponse {
    let res: MessageResponse = { success: false, message: "Error de validación del(los) campo(s): ", code: 0 };
    try {
        let campoError = [] as string[];
        Object.keys(movimientoRegex).forEach((key:string) => {
            const value = dataForm[key as keyof MovimientoForm];
            const regexValue = movimientoRegex[key as keyof MovimientoForm] as any;
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
