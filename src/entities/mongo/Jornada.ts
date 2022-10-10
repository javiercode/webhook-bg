import {Column, Entity, PrimaryColumn, CreateDateColumn, ObjectIdColumn,OneToOne,OneToMany} from 'typeorm';
import { ObjectID } from 'mongodb';
import { JornadaDto } from '../dto/JornadaDto';

@Entity('Jornada')
export class Jornada {
    
    @ObjectIdColumn()
    public id: ObjectID;

    @Column()
    public tipo:string;

    @Column()
    public fecha:Date;

    @Column()
    public latitud:number;
    
    @Column()
    public longitud:number;

    @Column({default:'A'})
    public estado:string

    @CreateDateColumn()
    public fechaRegistro:Date

    @Column()
    public usuarioRegistro:string

    @Column()
    public sucursalRegistro:number

    @Column()
    public fechaModificacion:Date

    @Column()
    public usurioModificacion:string

    @Column()
    public sucursalModificacion:number


    constructor(params: JornadaDto = {} as JornadaDto){
        this.tipo = params.tipo;
        this.latitud = params.latitud;
        this.longitud = params.longitud;
        this.fechaRegistro = params.fechaRegistro || this.fechaRegistro;
        this.usuarioRegistro = params.usuarioRegistro || this.usuarioRegistro;
        this.sucursalRegistro = params.sucursalRegistro || this.sucursalRegistro;
    }
}