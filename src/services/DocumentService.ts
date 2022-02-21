import mongoose, { Schema } from 'mongoose';
import Model from '../models/model';

const ensureCollection = (collectionName: string) => {
  let collection: any;
  try {
    const schema = new Schema({}, { strict: false })
    collection = mongoose.model(collectionName, schema);
  } catch (error) {
    collection = mongoose.model(collectionName)
  }

  return collection;
}

export const getDocuments = async (modelId: string, limit = 1000, offset = 0, dateFilter = '2018-08-01T00:00:03+0000'): Promise<any[]> => {
  const model = await Model.findById(modelId).exec();

  const collection = ensureCollection(model.collectionName);

  const result = await collection.find().skip(offset).limit(limit).exec();

  const arr: Document[] = result.map((e: any) => {
    return {
      id: e[model.mappings.id],
      name: e[model.mappings.name],
      date: e[model.mappings.date],
      vector3: {
        x: e[model.mappings.vector3][0],
        y: e[model.mappings.vector3][1],
        z: e[model.mappings.vector3][2],
      }
    } as unknown as Document;
  })
  return arr;
}

export const getDocument = async (modelId: string, documentId: string) => {

  const model = await Model.findById(modelId).exec();

  const collection = ensureCollection(model.collectionName);

  const document = await collection.findById(documentId).exec();

  return document;
}