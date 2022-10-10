import { Request, response, Response } from "express";
import { getAuthUser } from '../configs/TokenMiddleware';
import TareaService from '../services/Tarea.service';
import {TareaDto, TareaEditDto, TareaEstadoDto, TareaForm, tareaRegex} from '../entities/dto/TareaDto';
import { EstadoTareaEnum, TypeKeyParamEnum } from "../configs/Config.enum";
import { MessageResponse } from "../entities/dto/GeneralDto";
import { getFecha, getStrFecha, validateParams } from "../configs/General.functions";

export async function test (req: Request, res:Response){
    // res.status(501)
    // const {page,limit} =req.params;
    // const result = TareaService.listTest(parseInt(limit),parseInt(page),getAuthUser(req));
    return res.status(501).send("TEST");
}

export async function list (req: Request, res:Response){
    const {page,limit} =req.params;
    const resultPage = validateParams(page,TypeKeyParamEnum.PAGE)
    const resultLimit = validateParams(limit,TypeKeyParamEnum.LIMIT)
    let result;
    if(resultLimit.success && resultPage.success){
        result = await TareaService.list(parseInt(limit),parseInt(page),getAuthUser(req));
    }else{
        result = resultLimit.success? resultPage: resultLimit;
    }
    return res.status(200).send(result);
}

export async function listPorEstado (req: Request, res:Response){
    const {page,limit,tipo} =req.params;
    const resultPage = validateParams(page,TypeKeyParamEnum.PAGE);
    const resultLimit = validateParams(limit,TypeKeyParamEnum.LIMIT);
    const resultTipo = validateParams(tipo,TypeKeyParamEnum.TIPO_TAREA);
    let result;
    if(resultLimit.success && resultPage.success && resultTipo.success){
        result = await TareaService.listPorEstado(parseInt(limit),parseInt(page),tipo,getAuthUser(req));
    }else{
        result = !resultLimit.success? resultLimit:(resultPage.success? resultTipo: resultPage);
    }
    return res.status(200).send(result);
}

export async function create (req: Request, res:Response){
    const userDto = req.body as TareaDto;
    let result = validate(toIFormValidateCreate(userDto));

    if(result.success){
        result = await TareaService.create(userDto,getAuthUser(req));
    }
    return res.status(200).send(result);
}

export async function edit (req: Request, res:Response){
    const userDto = req.body as TareaEditDto;
    const resultPk = validateParams(req.params.id,TypeKeyParamEnum.OBJECT_ID)
    let result = validate(toIFormValidateEdit(userDto));

    if(result.success && resultPk.success){
        result = await TareaService.edit(req.params.id ,userDto,getAuthUser(req));
    }else{
        result = result.success? resultPk: result;
    }

    return res.status(200).send(result);
}

export async function atender (req: Request, res:Response){
    let result = validateParams(req.params.id,TypeKeyParamEnum.OBJECT_ID);
    if(result.success){
        result = await TareaService.cambiarEstado(req.params.id ,EstadoTareaEnum.PROCESO,getAuthUser(req));
    }
    return res.status(200).send(result);
}

export async function finalizar (req: Request, res:Response){
    let result = validateParams(req.params.id,TypeKeyParamEnum.OBJECT_ID);
    if(result.success){
        result = await TareaService.cambiarEstado(req.params.id ,EstadoTareaEnum.FINALIZADO,getAuthUser(req));
    }
    return res.status(200).send(result);
}

export async function desactivar (req: Request, res:Response){
    let result = validateParams(req.params.id,TypeKeyParamEnum.OBJECT_ID);
    if(result.success){
        result = await TareaService.desactivar(req.params.id,getAuthUser(req));
    }
    return res.status(200).send(result);
}

function validate(dataForm: TareaForm ): MessageResponse {
    let res: MessageResponse = { success: false, message: "Error de validación del(los) campo(s): ", code: 0 };
    try {
        let campoError = [] as string[];
        Object.keys(tareaRegex).forEach((key:string) => {
            const value = dataForm[key as keyof TareaForm];
            const regexValue = tareaRegex[key as keyof TareaForm] as any;
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

function toIFormValidateCreate(dataForm: TareaDto  ): TareaForm {
    let res: TareaForm = { 
        tipo:dataForm.tipo,
        codCliente:dataForm.codCliente,
        responsable:dataForm.responsable,
        fecha: getStrFecha({date:dataForm.fecha}),
        recordatorio:dataForm.recordatorio.toString(),
        motivo:dataForm.motivo,
        referencia:dataForm.referencia 
};    
    return res;
}
function toIFormValidateEdit(dataForm: TareaEditDto ): TareaForm {
    let res: TareaForm = { 
        tipo:dataForm.tipo,
        codCliente:"00000fffff00000fffff0000",
        responsable:dataForm.responsable,
        fecha: getStrFecha({date:dataForm.fecha}),
        recordatorio:dataForm.recordatorio.toString(),
        motivo:dataForm.motivo,
        referencia:dataForm.referencia 
    }; 
    
    return res;
}