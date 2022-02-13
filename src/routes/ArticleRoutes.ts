import { Router, Request, Response } from 'express';
import * as ArticleController from '../controllers/ArticleController';
import Article from '../models/articles';
import { Mongoose } from 'mongoose';

const ArticleRouter: Router = Router({ mergeParams: true });

ArticleRouter.get("/", ArticleController.getFirstArticles);

export default ArticleRouter