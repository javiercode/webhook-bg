import {Column, Entity, PrimaryColumn, CreateDateColumn, ObjectIdColumn, OneToOne, JoinColumn,ManyToOne, BaseEntity } from 'typeorm';
import { ObjectID } from 'mongodb';
import {TurnoDto} from '../dto/TurnoDto'

@Entity('Turno')
export class Turno{
    
    @ObjectIdColumn()
    public id: ObjectID;

    @Column()
    responsable:string

    @Column()
    tipo:string

    @Column()
    descripcion:string

    @Column()
    turno:number

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

    
    constructor(params: TurnoDto = {} as TurnoDto){
        this.responsable=params.responsable;
        this.descripcion=params.descripcion;
        this.turno=params.turno;
        this.tipo=params.tipo;
    
        this.usuarioRegistro = params.usuarioRegistro|| this.usuarioRegistro;
        this.fechaRegistro = params.fechaRegistro|| new Date();
        this.sucursalRegistro = params.sucursalRegistro || this.sucursalRegistro;
        this.estado = params.estado || 'A';
        
    }
}