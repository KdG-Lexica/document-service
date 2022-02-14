import { formatISO } from "date-fns";
import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/HttpException";
import * as ArticleService from "../services/ArticleService";

export const getFirstArticles = async (req: Request, res: Response, next: NextFunction) => {
    const { limit } = req.query;
    const data = await ArticleService.getFirstArticles(+limit);
    return res.json(data);
}

export const getArticleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const data = await ArticleService.getArticleById(id);
        return res.json(data);
    } catch (e) {
        return next(new HttpException(500, e));
    }
}