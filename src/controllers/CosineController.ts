import { formatISO } from "date-fns";
import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { HttpException } from "../exceptions/HttpException";

import * as CosineService from '../services/CosineService';

export const GetCosineCloseDocuments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { model } = req.params;

    const { rangeFactor, document } = req.query;

    const data = await CosineService.GetCosineCloseDocuments(+model, document as string, +rangeFactor);

    return res.json(data);
  } catch (error) {
    return next(new HttpException(500, error))
  }
}