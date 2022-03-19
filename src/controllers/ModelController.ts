import { Request, Response, NextFunction } from "express";
import VectorModel from "../models/VectorModel";
import { HttpException } from "../exceptions/HttpException";

import * as ModelService from '../services/ModelService';
import * as IndexTaskService from '../services/IndexTaskService';

import { CreateModelDto } from "../dtos/model";

export const createModel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = req.body as CreateModelDto;

    const indexTask = await ModelService.initModel(dto);

    return res.json(indexTask);
  } catch (error) {
    return next(new HttpException(500, error))
  }
}

export const getModel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { model } = req.params;

    const result = await ModelService.getModel(+model);

    return res.json(result);

  } catch (error) {
    return next(new HttpException(500, error))
  }
}

export const getModels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ModelService.getModels();

    return res.json(result);
  } catch (error) {
    return next(new HttpException(500, error))
  }
}

export const updateModel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { modelId } = req.params
    const { model } = req.body;
    await ModelService.updateModel({
      _id: modelId,
      ...model
    } as Partial<VectorModel>)
    return res.end();
  } catch (error) {
    return next(new HttpException(500, error))
  }
}

export const deleteModel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { model } = req.params;
    await ModelService.deleteModel(model)
    return res.end();
  } catch (error) {
    return next(new HttpException(500, error))
  }
}

export const getIndexTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { taskId } = req.params;
    const task = await IndexTaskService.getIndexTask(+taskId);
    return res.json(task);
  } catch (error) {
    return next(new HttpException(500, error))
  }
}

export const getIndexTasks =  async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = await IndexTaskService.getIndexTasks();
    return res.json(tasks);
  } catch (error) {
    return next(new HttpException(500, error))
  }
}