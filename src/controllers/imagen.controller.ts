import { Request, response, Response } from "express";
import { getAuthUser } from '../configs/TokenMiddleware';
import imagenService from '../services/Imagen.service';
import {ImagenDto} from '../entities/dto/ImagenDto';

export async function test (req: Request, res:Response){
    res.status(501)
}

export async function list (req: Request, res:Response){
    const {page,limit} =req.params;
    const users = imagenService.list(parseInt(limit),parseInt(page)).then(result=>{
        res.status(200).send(result);
    });
}

export async function findId (req: Request, res:Response){
    const {id} =req.params;
    const users = imagenService.findOne(id).then(result=>{
        res.status(200).send(result);
    });
}

export async function create (req: Request, res:Response){
    const imagenDto = req.body as ImagenDto;
    const users = imagenService.create(imagenDto,getAuthUser(req)).then(result=>{
        res.status(200).send(result);
    });
}

export async function desactivar (req: Request, res:Response){
    const users = imagenService.desactivar(req.params.id,getAuthUser(req)).then(result=>{
        res.status(200).send(result);
    });
}