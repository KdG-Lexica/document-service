import { Router, Request, Response } from 'express';
import * as DocumentController from '../controllers/DocumentController';

const DocumentRouter: Router = Router({ mergeParams: true });

DocumentRouter.get('/:model', DocumentController.getDocuments)

export default DocumentRouter