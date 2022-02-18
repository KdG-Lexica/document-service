import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/HttpException";

import * as DocumentService from '../services/DocumentService';

export const getDocuments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { model } = req.params;
    const { limit, offset } = req.query;

    const result = await DocumentService.getDocuments(model , +limit, +offset);
    return res.json(result)
  } catch (error) {
    return next(new HttpException(500, error));
  }
}

export const getDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { model, document } = req.params;
    console.log(req.params)
    const result = await DocumentService.getDocument(model, document);

    return res.json(result)
  } catch (error) {
    return next(new HttpException(500, error))
  }
}