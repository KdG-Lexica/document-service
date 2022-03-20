import { Request, Response, NextFunction } from "express";
import { CreateIPTCDto } from "../dtos/iptc";
import { HttpException } from "../exceptions/HttpException";

import * as IPTCServices from '../services/IPTCService';

export const List = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sets = await IPTCServices.ListIPTCSets();
    return res.json(sets);
  } catch (error) {
    return next(new HttpException(500, error))
  }
}

export const Get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const set = await IPTCServices.GetIPTCSet(+id);

    return res.json(set);
  } catch (error) {
    return next(new HttpException(500, error))
  }
}

export const Create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = req.body as CreateIPTCDto

    const set = await IPTCServices.CreateIPTCSet(dto.name, dto.mongoCollection);

    return res.json(set);
  } catch (error) {
    return next(new HttpException(500, error))
  }
}
