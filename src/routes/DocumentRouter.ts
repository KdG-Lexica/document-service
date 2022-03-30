import { Router } from 'express';
import * as DocumentController from '../controllers/DocumentController';

import authMiddleware from '../middlewares/auth';

import CosineRouter from './CosineRouter';

import { GetDocumentsValidationRules, Validate } from '../validation';

const DocumentRouter: Router = Router({ mergeParams: true });

DocumentRouter.use(authMiddleware);
DocumentRouter.use('/cosine', CosineRouter);
DocumentRouter.get('/', DocumentController.getDocument)
DocumentRouter.post('/', GetDocumentsValidationRules(), Validate, DocumentController.getDocuments)

export default DocumentRouter