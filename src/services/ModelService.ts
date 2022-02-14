import Model from '../models/model';

export const createModel = (collectionName: string, mappings: any, meta: string[]) => {
  return Model.create({
    collectionName,
    meta,
    mappings
  })
}

export const getModel = (modelId: string) => {
  return Model.findById(modelId).exec();
}

export const getModels = () => {
  return Model.find().exec();
}