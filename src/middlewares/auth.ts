import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptions/HttpException';
import * as PermissionService from '../services/PermissionServices';
import * as ModelService from '../services/ModelService';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const model = await ModelService.getModel(+req.params.model)
  console.log(model);

  if (model.requiresPassword) {
    console.log('required pass');
    const permission = await PermissionService.getAllowedModelsForSession(req.cookies.session);

    if (!permission.find(e => e.VectorModelId === +req.params.model)) {
      return next(new HttpException(403, 'no-permission'))
    }

    next();
  } else {
    return next();
  }
}

export default authMiddleware;