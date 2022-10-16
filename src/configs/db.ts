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


export const MongoDataSource = new DataSource({
    type: "mongodb",
    url: process.env.MONGO_URL,
    database: process.env.MONGO_DATABASE,
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

