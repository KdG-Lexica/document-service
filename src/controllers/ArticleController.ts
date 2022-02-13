import { formatISO } from "date-fns";
import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/HttpException";
import * as ArticleService from "../services/ArticleService";

export const getFirstArticles = async (req: Request, res: Response, next: NextFunction) => {
    const data = await ArticleService.getFirstArticles(5);
    return res.json(data);
}