import {MessageResponse} from '../../entities/dto/GeneralDto';
import { Request, response, Response } from "express";

export interface IAuth {
    auth: (username: string, password: string) => Promise<MessageResponse>;
}