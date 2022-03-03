import { Router } from 'express';
import * as DocumentController from '../controllers/DocumentController';

const CosineRouter: Router = Router({ mergeParams: true });

import * as CosineController from '../controllers/CosineController';

CosineRouter.get('/', CosineController.GetCosineCloseDocuments)

export default CosineRouter