import {Column, Entity, PrimaryColumn, CreateDateColumn, ObjectIdColumn, OneToOne, JoinColumn,ManyToOne, BaseEntity } from 'typeorm';
import { ObjectID } from 'mongodb';
import {TurnoDto} from '../dto/TurnoDto'

@Entity('Asignacion')
export class Asignacion{
    
    @ObjectIdColumn()
    public id: ObjectID;

    @Column()
    responsable:string

    @Column()
    fecha:Date

    @Column()
    observacion:string

    @Column()
    codTurno:ObjectID

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
        this.fecha=params.fecha;
        this.observacion=params.observacion;
        this.codTurno=params.codTurno;
    
        this.usuarioRegistro = params.usuarioRegistro|| this.usuarioRegistro;
        this.fechaRegistro = params.fechaRegistro|| new Date();
        this.sucursalRegistro = params.sucursalRegistro || this.sucursalRegistro;
        this.estado = params.estado || 'A';
        
    }
}