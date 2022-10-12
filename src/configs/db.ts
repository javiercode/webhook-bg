import { DataSource,createConnections } from "typeorm";
import { Cliente } from "../entities/mongo/Cliente";
import { Tarea } from "../entities/mongo/Tarea";
import { RolUsuario } from "../entities/mongo/RolUsuario";
import { RolAplicacion } from "../entities/mongo/RolAplicacion";
import { Movimiento } from "../entities/mongo/Movimiento";
import { Imagen } from "../entities/mongo/Imagen";
import { Jornada } from "../entities/mongo/Jornada";
import { Turno } from "../entities/mongo/Turno";
import { Asignacion } from "../entities/mongo/Asignacion";

const getUrlMongo = ()=>{
    var mongoURL = "mongodb://<user>:<password>@<host>:<port>/<dbname>?authSource=admin&socketTimeoutMS=90000&readPreference=primary&directConnection=true&ssl=false";
    mongoURL = mongoURL.replace("<user>",(process.env.MONGO_USER || ""));
    mongoURL = mongoURL.replace("<password>",(process.env.MONGO_PASSWORD || ""));
    mongoURL = mongoURL.replace("<host>",(process.env.MONGO_HOST || ""));
    mongoURL = mongoURL.replace("<port>",(process.env.MONGO_PORT || ""));
    mongoURL = mongoURL.replace("<dbname>",(process.env.MONGO_DATABASE || ""));
    return mongoURL;
}

export const MongoDataSource = new DataSource({
    type: "mongodb",
    url: getUrlMongo(),
    // database: process.env.MONGO_DATABASE,
    synchronize: true,
    logging: false,
    entities: [
        // "src/entities/mongo/*.ts"
        RolUsuario,RolAplicacion,Cliente,Tarea,Imagen,Movimiento,Jornada,Turno,Asignacion
    ],
    subscribers: [
        // "src/subscriber/*.js"
    ],
    migrations: [
        // "src/migration/*.js"
    ],
})

