import { Request, response, Response } from "express";
import { getAuthUser } from '../configs/TokenMiddleware';
import AsignacionService from '../services/Asignacion.service';
import { AsignacionDto, AsignacionEditDto, AsignacionForm, AsignacionRegex} from '../entities/dto/AsignacionDto';
import { getFecha, validateParams } from "../configs/General.functions";
import { TypeKeyParamEnum } from "../configs/Config.enum";
import { MessageResponse } from "../entities/dto/GeneralDto";

export async function test (req: Request, res:Response){
    return res.status(501)
}

export async function list (req: Request, res:Response){
    const {page,limit} =req.params;
    const resultPage = validateParams(page,TypeKeyParamEnum.PAGE)
    const resultLimit = validateParams(limit,TypeKeyParamEnum.LIMIT)
    let result;
    if(resultLimit.success && resultPage.success){
        result = await AsignacionService.list(parseInt(limit),parseInt(page));
    }else{
        result = resultLimit.success? resultPage: resultLimit;
    }
    return res.status(200).send(result);
}

export async function create (req: Request, res:Response){
    const userDto = req.body as AsignacionDto;
    let result = validate(toIFormValidateCreate(userDto));
    if(result.success){
        result = await AsignacionService.create(userDto,getAuthUser(req));
    }
    return res.status(200).send(result);
}


export async function desactivar (req: Request, res:Response){
    let result = validateParams(req.params.id,TypeKeyParamEnum.OBJECT_ID)
    if(result.success){
        result = await AsignacionService.desactivar(req.params.id,getAuthUser(req));
    }
    return res.status(200).send(result);
}

function validate(dataForm: AsignacionForm ): MessageResponse {
    let res: MessageResponse = { success: false, message: "Error de validación del(los) campo(s): ", code: 0 };
    try {
        let campoError = [] as string[];
        Object.keys(AsignacionRegex).forEach((key:string) => {
            const value = dataForm[key as keyof AsignacionForm];
            const regexValue = AsignacionRegex[key as keyof AsignacionForm] as any;
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


function toIFormValidateCreate(dataForm: AsignacionDto  ): AsignacionForm {
    let res: AsignacionForm = { 
        responsable: dataForm.responsable,
        fecha: dataForm.fecha.toString(),
        observacion: dataForm.observacion,
        codTurno: dataForm.codTurno, };    
    return res;
}