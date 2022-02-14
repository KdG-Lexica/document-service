import mongoose, { Schema } from 'mongoose';
import Model from '../models/model';

export const getDocuments = async (modelId: string): Promise<any[]> => {
  const res = await Model.find().limit(1).exec();

  const model = res[0];



  let collection: any;
  try {
    const schema = new Schema({}, { strict: false})
    collection = mongoose.model(model.collectionName, schema);
  } catch (error) {
    collection = mongoose.model(model.collectionName)
  }


  const result = await collection.find().limit(10).exec();

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