import {Column, Entity, PrimaryColumn, CreateDateColumn, ObjectIdColumn, OneToOne, JoinColumn,ManyToOne, BaseEntity } from 'typeorm';
import { ObjectID } from 'mongodb';
import {Tarea} from './Tarea'
import {Imagen} from './Imagen'
import {MovimientoDto} from '../dto/MovimientoDto'

@Entity('Movimiento')
export class Movimiento{
    
    @ObjectIdColumn()
    public id: ObjectID;

    @Column()
    tipo:string

    @Column()
    fecha:Date

    @Column()
    latitud:string
    
    @Column()
    longitud:string

    @ObjectIdColumn()
    codImagen:string

    @ObjectIdColumn()
    codTarea:string

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

    @Column()
    imagen:Imagen

    @Column()
    tarea:Tarea
    
    constructor(params: MovimientoDto = {} as MovimientoDto){
        this.tipo = params.tipo;
        this.latitud = params.latitud;
        this.longitud = params.longitud;
        this.codTarea = params.codTarea;
        this.codImagen = params.codImagen;
        this.usuarioRegistro = params.usuarioRegistro|| this.usuarioRegistro;
        this.fechaRegistro = params.fechaRegistro|| new Date();
        this.sucursalRegistro = params.sucursalRegistro || this.sucursalRegistro;
        this.estado = params.estado || 'A';
        if(params.imagen){
            this.imagen = params.imagen;
        }
        if(params.tarea){
            this.tarea = params.tarea;
        }
    }
}