import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/HttpException";

import * as ModelService from '../services/ModelService';

export const createModel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { collectionName, meta, mappings } = req.body;


    await ModelService.createModel(collectionName, mappings, meta);

    return res.end();
  } catch (error) {
    return next(new HttpException(500, error))
  }
}

export const getModel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { model } = req.params;

    const result = await ModelService.getModel(model);

    return res.json(result);

  } catch (error) {
    return next(new HttpException(500, error))
  }
}

export const getModels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ModelService.getModels();

    return res.json(result);
  } catch (error) {
    return next(new HttpException(500, error))
  }
}
