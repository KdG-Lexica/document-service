import { Router } from 'express';
import * as IPTCController from '../controllers/IPTCController';

const IPTCRouter: Router = Router({ mergeParams: true });

IPTCRouter.get('/', IPTCController.List)
IPTCRouter.get('/:id', IPTCController.Get);
IPTCRouter.post('/', IPTCController.Create);

export default IPTCRouter