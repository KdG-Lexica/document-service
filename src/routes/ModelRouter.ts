import { Router, Request, Response } from 'express';
import * as ModelController from '../controllers/ModelController';

const ModelRouter: Router = Router({ mergeParams: true });

ModelRouter.post('/', ModelController.createModel);
ModelRouter.get('/', ModelController.getModels)
ModelRouter.get('/:model', ModelController.getModel)

export default ModelRouter