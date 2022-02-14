import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/HttpException";

import * as DocumentService from '../services/DocumentService';

export const getDocuments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { model } = req.params;
    const result = await DocumentService.getDocuments(model);
    return res.json(result)
  } catch (error) {
    return next(new HttpException(500, error));
  }
}