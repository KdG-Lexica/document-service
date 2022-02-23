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
  switch (rule.operator) {
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


// als t kapot gaat, mij nie belle
export const getDocuments = async (modelId: string, filters: Filter[], limit = 1000, offset = 0, skipFactor = 0.5): Promise<any[]> => {
  const model = await Model.findById(modelId).exec();

  const collection = ensureCollection(model.collectionName);

  let query = collection;

  const filterObj: Record<string, any> = {};
  const orQueries: Filter[] = [];
  const andQueries: Filter[] = [];


  filters.forEach((filterItem, index) => {
    // this is a joining item
    if (filterItem.rules == null) {
      const prev = filters[index - 1];
      const next = filters[index + 1];

      if (filterItem.combinator === 'AND') {
        andQueries.push(prev, next);
      } else {
        orQueries.push(prev, next);
      }
    }
  })

  andQueries.forEach(q => {
    if (!Object.keys(filterObj).includes('$and')) Object.assign(filterObj, { '$and': [] })
    if (q.rules.length === 1) {
      filterObj.$and.push({
        [q.rules[0].field]: {
          $regex: generateRegex(q.rules[0])
        }
      })
    } else {
      const obj = {
        [`$${q.combinator.toLowerCase()}`]: q.rules.map(e => {
          return {
            [e.field]: {
              $regex: generateRegex(e)
            }
          }
        })
      }

      filterObj.$and.push(obj)
    }

  })

  orQueries.forEach(q => {
    if (!Object.keys(filterObj).includes('$or')) Object.assign(filterObj, { '$or': [] })
    if (q.rules.length === 1) {
      filterObj.$or.push({
        [q.rules[0].field]: {
          $regex: generateRegex(q.rules[0])
        }
      })

    } else {
      const obj = {
        [`$${q.combinator.toLowerCase()}`]: q.rules.map(e => {
          return {
            [e.field]: {
              $regex: generateRegex(e)
            }
          }
        })
      }

      filterObj.$or.push(obj)
    }

  })

  console.log('filter')
  console.log(JSON.stringify(filterObj))

  query = query.find(filterObj);
  query = query.skip(offset).limit(limit);
  const result = await query.exec()


  const arr: Document[] = result.filter(() => Math.random() > skipFactor).map((e: any) => {
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