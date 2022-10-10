import { Request, response, Response } from "express";
import { getAuthUser } from '../configs/TokenMiddleware';
import JornadaService from '../services/Jornada.service';
import {JorandaForm, JornadaDto, jornadaRegex} from '../entities/dto/JornadaDto';
import { validateParams } from "../configs/General.functions";
import { TypeKeyParamEnum } from "../configs/Config.enum";
import { MessageResponse } from "../entities/dto/GeneralDto";

export async function test (req: Request, res:Response){
    res.status(501)
}

export async function getEstado (req: Request, res:Response){
    const result = await JornadaService.getEstado(getAuthUser(req));
    return res.status(200).send(result);
}

export async function findId (req: Request, res:Response){
    const {id} =req.params;
    let result = validateParams(id,TypeKeyParamEnum.OBJECT_ID)
    if(result.success){
        result = await JornadaService.findById(id);
    }
    return res.status(200).send(result);
}

export async function marcar (req: Request, res:Response){
    const jornadaDto = req.body as JornadaDto;
    let result = validate({tipo:jornadaDto.tipo, latitud:jornadaDto.latitud.toString(),longitud:jornadaDto.longitud.toString()});
    if(result.success){
        result = await JornadaService.marcar(jornadaDto,getAuthUser(req));
    }
    return res.status(200).send(result);
}

export async function desactivar (req: Request, res:Response){
    let result = await JornadaService.desactivar(req.params.id,getAuthUser(req));
    return res.status(200).send(result);
}

function validate(dataForm: JorandaForm ): MessageResponse {
    let res: MessageResponse = { success: false, message: "Error de validación del(los) campo(s): ", code: 0 };
    try {
        let campoError = [] as string[];
        Object.keys(jornadaRegex).forEach((key:string) => {
            const value = dataForm[key as keyof JorandaForm];
            const regexValue = jornadaRegex[key as keyof JorandaForm] as any;
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
