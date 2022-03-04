import mongoose, { Schema } from 'mongoose';
import { Filter, Rule } from '../dtos/filter';

import { db } from '../db';

import * as ModelServices from './ModelService';
import VectorModel from '../models/VectorModel';
import IndexTask from '../models/IndexTask';

import { Model, ModelStatic, QueryTypes } from 'sequelize';

const ensureCollection = (collectionName: string) => {
  let collection: any;
  try {
    const schema = new Schema({
      _id: String
    }, { strict: false, _id: false })
    collection = mongoose.model(collectionName, schema);
  } catch (error) {
    collection = mongoose.model(collectionName);
  }

  return collection;
}

const generateSelectQuery = (filters: Filter[], tableName: string, limit: number, offset: number) => {
  let query = `SELECT id, name, date, vector$x, vector$y, vector$z FROM ${tableName} `;
  const replacements = [] as any[];

  if (filters.length > 0) {
    query += 'WHERE'
    filters.forEach(filter => {
      if (filter.rules === null) {
        query += ` ${filter.combinator} `
      } else {
        query += '('
        const checks: string[] = [];
        filter.rules.forEach(rule => {
          if (rule.operator === 'CONTAINS') checks.push(` meta$${rule.field} LIKE '%${rule.value}%' `)
          if (rule.operator === 'EQUALS') { checks.push(` meta$${rule.field} = ? `); replacements.push(rule.value) }
        })
        query += checks.join(` ${filter.combinator} `);
        query += ')'
      }
    });
  }

  query += ` LIMIT ${limit} OFFSET ${offset} `

  // remove multiple spaces: just for the looks 😉
  query = query.replace(/  +/g, ' ');

  return {
    query,
    replacements
  }
}

export const getDocuments = async (modelId: number, filters: Filter[], limit = 1000, offset = 0): Promise<any> => {
  const model = await ModelServices.getModel(modelId);

  const { query, replacements } = generateSelectQuery(filters, model.collectionName, limit, offset);

  const result = await db.query(query, {
    replacements,
    type: QueryTypes.SELECT
  });



  return {
    count: result.length,
    rows: result.map((e: any) => {
      return {
        id: e.id,
        name: e.name,
        date: e.date,
        vector3: {
          x: e.vector$x,
          y: e.vector$y,
          z: e.vector$z,
        }
      }
    })
  }
}

export const getDocument = async (modelId: number, documentId: string) => {

  const model = await ModelServices.getModel(modelId);
  const mongoCollection = ensureCollection(model.collectionName.split('_')[0]);
  console.log(mongoCollection);

  const document = await mongoCollection.findOne({ _id: documentId }).exec();

  return document;
}

export const countCollection = async (collectionName: string): Promise<number> => {
  const mongoCollection = ensureCollection(collectionName);
  return mongoCollection.count({});
}

export const syncModelToSql = async (vectorModel: VectorModel, sqlModel: ModelStatic<Model<any, any>>, indexTask: IndexTask) => {
  const mongoCollection = ensureCollection(vectorModel.collectionName.split('_')[0]);
  const mappings = await vectorModel.getMappings();
  const meta = await vectorModel.getMeta();

  const getDescendantProp = (obj: any, desc: string) => {
    return desc.split('.').reduce((a, b) => {
      return a[b];
    }, obj);
  }


  let arr: any[] = [];
  let x = 0;
  mongoCollection.find().cursor().eachAsync(async (document: any) => {
    if (!document) return;
    const obj = {
      id: document[mappings.find(e => e.key === 'id').value],
      name: getDescendantProp(document, mappings.find(e => e.key === 'name').value),
      date: document[mappings.find(e => e.key === 'date').value],
      ['vector$x']: document[mappings.find(e => e.key === 'vector3').value][0],
      ['vector$y']: document[mappings.find(e => e.key === 'vector3').value][1],
      ['vector$z']: document[mappings.find(e => e.key === 'vector3').value][2],
      cosineArray: document[vectorModel.cosineArray].join(',')
    }

    meta.forEach((metaItem) => {
      Object.assign(obj, {
        [`meta$${metaItem.key}`]: document[metaItem.key]
      })
    })

    arr.push(obj)
    if (arr.length === 1000) {
      await sqlModel.bulkCreate(arr);
      x += 1000
      await indexTask.update({ recordsInserted: x });
      arr = [];
      if(x === indexTask.recordCount){
        await db.query(`CREATE INDEX vector_index ON ${vectorModel.collectionName} (vector$x, vector$y, vector$z)`);
      }
    }
  })
}

export const getCloseDocuments = (document: any, rangeFactor: number) => {
  console.log('no')
}