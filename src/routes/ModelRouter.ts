import { Router, Request, Response } from 'express';
import * as ModelController from '../controllers/ModelController';

const ModelRouter: Router = Router({ mergeParams: true });

import DocumentRouter from './DocumentRouter'

ModelRouter.post('/', ModelController.createModel);
ModelRouter.get('/', ModelController.getModels)
ModelRouter.get('/tasks', ModelController.getIndexTasks);
ModelRouter.get('/task/:taskId', ModelController.getIndexTask);
ModelRouter.patch('/:modelId', ModelController.updateModel);
ModelRouter.delete('/:modelId', ModelController.deleteModel);


ModelRouter.use('/:model/documents', DocumentRouter);
ModelRouter.get('/:model', ModelController.getModel)



export default ModelRouter