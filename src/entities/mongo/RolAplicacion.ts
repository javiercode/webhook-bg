import {Column, Entity, PrimaryColumn, CreateDateColumn, ObjectIdColumn,OneToOne,OneToMany} from 'typeorm';
import { ObjectID } from 'mongodb';
import { RolAplicacionDto } from '../dto/RolAplicacionDto';

@Entity('RolAplicacion')
export class RolAplicacion {

    @ObjectIdColumn()
    public id: ObjectID;

    @Column()
    codigo:string

    @Column()
    descripcion:string

    @Column()
    jerarquia:number

    @Column()
    usuarioRegistro:string

    @CreateDateColumn()
    public fechaRegistro:Date

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

    constructor(params: RolAplicacionDto = {} as RolAplicacionDto){
        this.codigo=params.codigo,
        this.descripcion=params.descripcion,
        this.jerarquia=params.jerarquia,
        this.usuarioRegistro = params.usuarioRegistro || this.usuarioRegistro;
        this.sucursalRegistro = params.sucursalRegistro || this.sucursalRegistro;
        this.estado = 'A';
    }
}