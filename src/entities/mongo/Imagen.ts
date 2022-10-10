import {Column, Entity, PrimaryColumn, CreateDateColumn, ObjectIdColumn,OneToOne,OneToMany} from 'typeorm';
import { ObjectID, ObjectId } from 'mongodb';
import { Tarea } from './Tarea';
import { ImagenDto } from '../dto/ImagenDto';

@Entity('Imagen')
export class Imagen {
    
    @ObjectIdColumn()
    id:ObjectID;

    @Column()
    url:string

    @Column({default:'A'})
    estado:string

    @CreateDateColumn()
    fechaRegistro:Date

    @Column()
    usuarioRegistro:string

    @Column()
    sucursalRegistro:number

    @Column()
    fechaModificacion:Date

    @Column()
    usurioModificacion:string

    @Column()
    sucursalModificacion:number


    constructor(params: ImagenDto = {} as ImagenDto){
        this.url = params.url;       
        this.usuarioRegistro = params.usuarioRegistro || this.usuarioRegistro;
        this.sucursalRegistro = params.sucursalRegistro || this.sucursalRegistro;
        this.fechaRegistro = params.fechaRegistro || this.fechaRegistro;
    }
}