import { Request, response, Response } from "express";
import { getAuthUser } from '../configs/TokenMiddleware';
import TurnoService from '../services/Turno.service';
import { TurnoDto, TurnoEditDto, TurnoForm, TurnoRegex} from '../entities/dto/TurnoDto';
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
        result = await TurnoService.list(parseInt(limit),parseInt(page));
    }else{
        result = resultLimit.success? resultPage: resultLimit;
    }
    return res.status(200).send(result);
}

export async function create (req: Request, res:Response){
    const userDto = req.body as TurnoDto;
    let result = validate(toIFormValidateCreate(userDto));
    if(result.success){
        result = await TurnoService.create(userDto,getAuthUser(req));
    }
    return res.status(200).send(result);
}


export async function desactivar (req: Request, res:Response){
    let result = validateParams(req.params.id,TypeKeyParamEnum.OBJECT_ID)
    if(result.success){
        result = await TurnoService.desactivar(req.params.id,getAuthUser(req));
    }
    return res.status(200).send(result);
}

function validate(dataForm: TurnoForm ): MessageResponse {
    let res: MessageResponse = { success: false, message: "Error de validación del(los) campo(s): ", code: 0 };
    try {
        let campoError = [] as string[];
        Object.keys(TurnoRegex).forEach((key:string) => {
            const value = dataForm[key as keyof TurnoForm];
            const regexValue = TurnoRegex[key as keyof TurnoForm] as any;
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


function toIFormValidateCreate(dataForm: TurnoDto  ): TurnoForm {
    let res: TurnoForm = { 
        responsable: dataForm.responsable,
        descripcion: dataForm.descripcion,
        turno: dataForm.turno.toString(),
        tipo: dataForm.tipo, };    
    return res;
}