import { Router } from 'express';
import * as ModelController from '../controllers/ModelController';


import { ModelCreationValidationRules, Validate } from '../validation';

const ModelRouter: Router = Router({ mergeParams: true });

import DocumentRouter from './DocumentRouter'

ModelRouter.post('/', ModelCreationValidationRules(), Validate, ModelController.createModel);
ModelRouter.get('/', ModelController.getModels)

ModelRouter.get('/tasks', ModelController.getIndexTasks);
ModelRouter.get('/task/:taskId', ModelController.getIndexTask);
ModelRouter.post('/task/:taskId/cancel', ModelController.canceIndexTask);
ModelRouter.patch('/:modelId', ModelController.updateModel);
ModelRouter.delete('/:modelId', ModelController.deleteModel);

ModelRouter.post('/:modelId/unlock', ModelController.unlockModel);

ModelRouter.use('/:model/documents', DocumentRouter);
ModelRouter.get('/:model', ModelController.getModel)



export default ModelRouter