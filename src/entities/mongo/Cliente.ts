import {Column, Entity, PrimaryColumn, CreateDateColumn, ObjectIdColumn,OneToOne,OneToMany} from 'typeorm';
import { ObjectID } from 'mongodb';
import { Tarea } from './Tarea';
import { ClienteDto } from '../dto/ClienteDto';

@Entity('Cliente')
export class Cliente {
    
    @ObjectIdColumn()
    public id: ObjectID;

    @Column()
    public nombre:string

    @Column()
    public telefono1:string

    @Column()
    public telefono2:string

    @Column()
    public direccion:string

    @Column()
    public ci:string

    @Column()
    public complemento:string

    @Column()
    public extension:string

    @Column()
    public comentario:string

    @Column()
    nroPersona:number

    @Column({default:'A'})
    estado:string

    @Column()
    ubicacion:string
    
    @Column()
    latitud:string
    
    @Column()
    longitud:string

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

    constructor(params: ClienteDto = {} as ClienteDto){
        this.nombre = params.nombre;
        this.telefono1 = params.telefono1;
        this.telefono2 = params.telefono2;
        this.direccion = params.direccion;
        this.ci = params.ci;
        this.extension = params.extension;
        this.complemento = params.complemento;
        this.comentario = params.comentario;
        this.usuarioRegistro = params.usuarioRegistro || this.usuarioRegistro;
        this.sucursalRegistro = params.sucursalRegistro || this.sucursalRegistro;
        this.latitud = params.latitud;
        this.longitud = params.longitud;
        this.estado = 'A';
    }
}