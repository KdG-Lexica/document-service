import { Router, Request, Response } from 'express';
import * as DocumentController from '../controllers/DocumentController';

import CosineRouter from './CosineRouter';


const DocumentRouter: Router = Router({ mergeParams: true });


DocumentRouter.use('/:document/cosine', CosineRouter);
DocumentRouter.get('/:document', DocumentController.getDocument)
DocumentRouter.post('/', DocumentController.getDocuments)

export default DocumentRouter