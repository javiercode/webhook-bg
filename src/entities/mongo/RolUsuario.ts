import {Column, Entity, PrimaryColumn, CreateDateColumn, ObjectIdColumn,OneToOne,OneToMany} from 'typeorm';
import { ObjectID } from 'mongodb';
import { RolUsuarioDto } from '../dto/RolUsuarioDto';

@Entity('RolUsuario')
export class RolUsuario {

    @ObjectIdColumn()
    public id: ObjectID;

    @Column()
    codRolAplicacion:string

    @Column()
    usuario:string

    @Column()
    sucursal:number

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
    
    @Column({default:'A'})
    estado:string

    constructor(params: RolUsuarioDto = {} as RolUsuarioDto){
        this.codRolAplicacion=params.codRolAplicacion,
        this.usuario=params.usuario,
        this.sucursal=params.sucursal,
        this.usuarioRegistro = params.usuarioRegistro || this.usuarioRegistro;
        this.sucursalRegistro = params.sucursalRegistro || this.sucursalRegistro;
        this.estado = 'A';
    }
}