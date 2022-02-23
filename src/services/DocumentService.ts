import { ObjectId } from 'mongodb';
import mongoose, { Schema } from 'mongoose';
import { Filter, Rule } from '../dtos/filter';
import Model from '../models/model';

const ensureCollection = (collectionName: string) => {
  let collection: any;
  try {
    const schema = new Schema({}, { strict: false, _id: false })
    collection = mongoose.model(collectionName, schema);
  } catch (error) {
    collection = mongoose.model(collectionName)
  }

  return collection;
}

const generateRegex = (rule: Rule): string => {
  let regex = '.*'
  switch(rule.operator){
    case 'CONTAINS': {
      regex = `.*${rule.value}*.`
      break;
    };
    case 'EQUALS': {
      regex = rule.value
      break;
    }
  }
  return regex;
}

export const getDocuments = async (modelId: string, filters: Filter[], limit = 1000, offset = 0, dateFilter = '2018-08-01T00:00:03+0000'): Promise<any[]> => {
  const model = await Model.findById(modelId).exec();

  const collection = ensureCollection(model.collectionName);

  let query = collection;

  const filterObj: Record<string, any> = {};

  filters.forEach(filterItem => {
    if(!filterObj[`$${filterItem.combinator.toLowerCase()}`]) filterObj[`$${filterItem.combinator.toLowerCase()}`] = []
    filterItem.rules.forEach(rule => {

      const blockFilter = {};
      Object.assign(blockFilter, {
        [rule.field]: {
          $regex: generateRegex(rule)
        }
      })
      filterObj[`$${filterItem.combinator.toLowerCase()}`].push(blockFilter)
    })
  })


  console.log(filterObj)

  query = query.find(filterObj);



  query = query.skip(offset).limit(limit);
  const result = await query.exec()


  const arr: Document[] = result.map((e: any) => {
    return {
      id: e[model.mappings.id],
      name: model.mappings.name.split('.').reduce((a: any, b: any) => a[b], e),
      date: e[model.mappings.date],
      vector3: {
        x: e[model.mappings.vector3][0],
        y: e[model.mappings.vector3][1],
        z: e[model.mappings.vector3][2],
      }
    } as unknown as DocumentType;
  })
  return arr;
}

export const getDocument = async (modelId: string, documentId: string) => {

  const model = await Model.findById(modelId).exec();


  const collection = ensureCollection(model.collectionName);

  console.log(documentId);
  const document = await collection.findOne({ _id: documentId }).exec();

  return document;
}