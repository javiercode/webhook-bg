// import * as moment from 'moment';
import moment from 'moment';
import { MessageResponse } from '../entities/dto/GeneralDto';
import { TypeKeyParamEnum } from './Config.enum';

export const formatFecha:string = "DD/MM/YYYY HH:mm:ss";


export function getStrFecha({ date = new Date() }: { date: string | Date }): string {
    let newDate: string = "";
    if (typeof date === "string") {
        newDate = moment(date, formatFecha).utc().utcOffset("-04:00").format(formatFecha);
    }
    if (date instanceof Date) {
        newDate = moment(date).utc().utcOffset("-04:00").format(formatFecha);
    }
    return newDate;
}

export function getFecha( date : Date | string): Date {
    let newDate: Date = new Date();
    if (typeof date === "string") {
        newDate = moment(date, formatFecha).utc().utcOffset("-04:00").toDate();
    }
    if (date instanceof Date) {
        newDate = moment(date).utc().utcOffset("-04:00").toDate();
    }
    return newDate;
}

export function validateParams(value: string,type:string): MessageResponse {
    let res: MessageResponse = { success: false, message: "Error de validación de datos ingresados.", code: 0 };
    let regex = new RegExp("");
    try {
        switch(type){
            case TypeKeyParamEnum.OBJECT_ID:
                regex = new RegExp("^[a-fA-F0-9]{20,50}$");
            break;
            case TypeKeyParamEnum.PK_ORACLE:
                regex = new RegExp("^[0-9]{1,5}$");
            break;
            case TypeKeyParamEnum.PAGE:
                regex = new RegExp("^[0-9]{1,4}$");
            break;
            case TypeKeyParamEnum.LIMIT:
                regex = new RegExp("^[0-9]{1,4}$");
            break;
            case TypeKeyParamEnum.USER:
                regex = new RegExp("^[a-zA-Z0-9]{1,4}$");
            break;
            case TypeKeyParamEnum.PARAM_BUSQUEDA:
                regex = new RegExp("^[a-zA-Z0-9 ñÑ]{1,150}$");
            break;
            case TypeKeyParamEnum.TIPO_TAREA:
                regex = new RegExp("^[A-Z]{1}$");
            break;
        }
        if (regex.test(value.toString())) {
            res.success=true;
            res.message= "Sin errores de validación.";
        }else{
            res.message="Error en el campo: "+type;
        }
    } catch (error) {
        console.error(error)
    }
    
    return res;
}