import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptions/HttpException';
import * as PermissionService from '../services/PermissionServices';
import * as ModelService from '../services/ModelService';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Overrides auth when this header is present
  if(req.headers['x-override-auth'] === 'a3000370-3a0d-414b-aaf7-04a1a43185d2'){
    
    res.locals.skipAuth = true;
    return next();
  }

  // Get model
  const model = await ModelService.getModel(+req.params.model)

  if (model.requiresPassword) {
    console.log('required pass');
    // Check if user has access to model's documents
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