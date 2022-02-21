import Model, { ModelProperties } from '../models/model';

export const createModel = (collectionName: string, mappings: any, meta: string[]) => {
  return Model.create({
    collectionName,
    meta,
    mappings
  })
}

export const getModel = (modelId: string) => {
  console.log(modelId);
  return Model.findById(modelId).exec();
}

export const getModels = () => {
  return Model.find().exec();
}

export const updateModel = (model: Partial<ModelProperties>) => {
  return Model.findByIdAndUpdate(model._id, model);
}

export const deleteModel = (modelId: string) => {
  return Model.deleteOne({
    _id: modelId
  })
}