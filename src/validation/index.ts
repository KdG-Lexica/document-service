import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { HttpException } from '../exceptions/HttpException';

import ModelCreationValidationRules from './rules/ModelCreationValidationRules';
import IPTCCreationValidationRules from './rules/IPTCCreationValidationRules';
import GetDocumentsValidationRules from './rules/GetDocumentsValidationRules';

const Validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)

  if (errors.isEmpty()) {
    return next()
  }

  const extractedErrors = [] as object[]

  errors.array().map(err => extractedErrors.push({
    [err.param]: {
      message: err.msg,
      location: err.location,
      value: err.value
    }
  }))

  return next(new HttpException(400, extractedErrors))
}

export {
  Validate,
  ModelCreationValidationRules,
  IPTCCreationValidationRules,
  GetDocumentsValidationRules
}