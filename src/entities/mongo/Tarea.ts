import {Column, Entity, PrimaryColumn, CreateDateColumn, ObjectIdColumn, OneToOne, JoinColumn,ManyToOne, BaseEntity } from 'typeorm';
import { ObjectID } from 'mongodb';
import {Cliente} from './Cliente'
import {TareaDto} from '../dto/TareaDto'

@Entity('Tarea')
export class Tarea{
    
    @ObjectIdColumn()
    id:ObjectID;

    @Column()
    codCliente:ObjectID

    @Column()
    tipo:string

    @Column()
    responsable:string

    @Column()
    fecha:Date

    @Column()
    recordatorio:number

    @Column()
    motivo:string

    @Column()
    referencia:string

    @Column({default:'A'})
    estado:string

    @CreateDateColumn()
    fechaFinalizacion:Date

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

    
    // @Column()
    // oCliente:Cliente

    // @OneToOne(() => Cliente)
    // @JoinColumn()
    // cliente: Cliente

    
    // @ManyToOne(() => Cliente, cliente => cliente.tareas) // specify inverse side as a second parameter
    cliente: Cliente;

    // constructor(tipo:string, codCliente:string, responsable:string, fecha:Date, recordatorio:number, motivo:string,referencia:string, usuarioRegistro:string, sucursalRegistro:number){
    //     this.tipo= tipo;
    //     this.codCliente= codCliente;
    //     this.responsable= responsable;
    //     this.fecha= fecha;
    //     this.recordatorio= recordatorio;
    //     this.motivo= motivo;
    //     this.referencia= referencia;
    //     this.usuarioRegistro = usuarioRegistro;
    //     this.sucursalRegistro = sucursalRegistro;
    //     this.estado = 'A';
    // }

    constructor(params: TareaDto = {} as TareaDto){
        this.tipo = params.tipo;
        this.responsable = params.responsable;
        this.fecha = params.fecha;
        this.recordatorio = params.recordatorio;
        this.motivo = params.motivo;
        this.referencia = params.referencia;
        this.usuarioRegistro = params.usuarioRegistro|| this.usuarioRegistro;
        this.fechaRegistro = params.fechaRegistro|| new Date();
        this.sucursalRegistro = params.sucursalRegistro || this.sucursalRegistro;
        this.estado = params.estado || 'A';
        if(params.cliente){
            this.cliente = params.cliente ;
        }
    }
}