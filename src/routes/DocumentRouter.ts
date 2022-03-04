import { Router, Request, Response } from 'express';
import * as DocumentController from '../controllers/DocumentController';

import CosineRouter from './CosineRouter';


const DocumentRouter: Router = Router({ mergeParams: true });


DocumentRouter.use('/cosine', CosineRouter);
DocumentRouter.get('/', DocumentController.getDocument)
DocumentRouter.post('/', DocumentController.getDocuments)

export default DocumentRouter