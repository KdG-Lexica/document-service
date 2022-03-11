import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/HttpException";

import * as DocumentService from '../services/DocumentService';

export const getDocuments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { model } = req.params;
    const { limit, offset, chunkData } = req.query;

    const { filter } = req.body;
    console.log(filter);

    const result = await DocumentService.getDocuments(+model, filter, +limit, +offset, chunkData === 'yes');
    return res.json(result)
  } catch (error) {
    return next(new HttpException(500, error));
  }
}

export const getDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { model } = req.params;

    const { document } = req.query

    const result = await DocumentService.getDocument(+model, document as string);

    return res.json(result)
  } catch (error) {
    return next(new HttpException(500, error))
  }
}