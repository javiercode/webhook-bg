
enum DepartamentoEnum  {
    COD_1 = 'CHUQUISACA',
    COD_2 = 'LA PAZ',
    COD_3 = 'COCHABAMBA',
    COD_4 = 'ORURO',
    COD_5 = 'POTOSI',
    COD_6 = 'TARIJA',
    COD_7 = 'SANTA CRUZ',
    COD_8 = 'BENI',
    COD_9 = 'PANDO'
}

export enum RolesTypeEnum {
    ADMIN = 'ADM',
    GERENTE = 'GER',
    JEFE = 'JEF',
    OFICIAL = 'OFI'
}


function getDepartamento(codigo:number) {
    switch (codigo) {
        case 1: return DepartamentoEnum["COD_1"]; break;
        case 2: return DepartamentoEnum["COD_2"]; break;
        case 3: return DepartamentoEnum["COD_3"]; break;
        case 4: return DepartamentoEnum["COD_4"]; break;
        case 5: return DepartamentoEnum["COD_5"]; break;
        case 6: return DepartamentoEnum["COD_6"]; break;
        case 7: return DepartamentoEnum["COD_7"]; break;
        case 8: return DepartamentoEnum["COD_8"]; break;
        case 9: return DepartamentoEnum["COD_9"]; break;
        default: return ""; break;
    }
}

export enum JornadaEnum {
    INICIO = 'INICIO',
    FIN = 'FIN',
    SEGUIMIENTO = 'SEGUIMIENTO',
}

export enum EstadoTareaEnum {
    FINALIZADO = 'F',
    ACTIVO = 'A',
    PROCESO = 'P',
    ELIMINADO = 'D',
}

export enum TypeKeyParamEnum {
    OBJECT_ID = 'objectId',
    PK_ORACLE = 'primaryKey',
    PAGE = 'pagina',
    LIMIT = 'limite',
    USER = 'usuario',
    PASSWORD = 'password',
    PARAM_BUSQUEDA = 'busqueda',
    TIPO_TAREA = 'Tipo tarea',
}

export  {DepartamentoEnum,getDepartamento,RolesTypeEnum as RolesType}