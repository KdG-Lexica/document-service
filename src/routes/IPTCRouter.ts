import { Router } from 'express';
import { Validate, IPTCCreationValidationRules } from '../validation';
import * as IPTCController from '../controllers/IPTCController';

const IPTCRouter: Router = Router({ mergeParams: true });

IPTCRouter.get('/', IPTCController.List)
IPTCRouter.get('/:id', IPTCController.Get);
IPTCRouter.post('/', IPTCCreationValidationRules(), Validate, IPTCController.Create);

export default IPTCRouter