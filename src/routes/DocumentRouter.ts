import { Router, Request, Response } from 'express';
import * as DocumentController from '../controllers/DocumentController';

const DocumentRouter: Router = Router({ mergeParams: true });

DocumentRouter.get('/:document', DocumentController.getDocument)
DocumentRouter.get('/', DocumentController.getDocuments)


export default DocumentRouter