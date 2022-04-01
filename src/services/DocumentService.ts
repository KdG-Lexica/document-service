import { Filter } from '../dtos/filter';
import { Model, ModelStatic, QueryTypes } from 'sequelize';
import { Collection, Document } from 'mongodb';

import { sql } from '../db';


import VectorModel from '../models/VectorModel';
import IndexTask, { TASK_STATE } from '../models/IndexTask';

import * as ModelServices from './ModelService';


const generateSelectQuery = (filters: Filter[], tableName: string, limit: number, offset: number) => {
  let query = "SELECT id, name, vector$x, vector$y, vector$z, chunk FROM   `" + tableName + "` ";
  const replacements = [] as any[];

  // This is the filter
  if (filters.length > 0) {
    query += 'WHERE'
    filters.forEach(filter => {
      if (filter.rules === null) {
        query += ` ${filter.combinator} `
      } else {
        query += '('
        const checks: string[] = [];
        filter.rules.forEach(rule => {
          if (rule.operator === 'CONTAINS') { checks.push(` meta$${rule.field} LIKE '%${rule.value}%' `) }
          if (rule.operator === 'DOES_NOT_CONTAIN') { checks.push(` meta$${rule.field} NOT LIKE '%${rule.value}%' `) }
          if (rule.operator === 'EMPTY') { checks.push(` meta$${rule.field} = ''`) }
          if (rule.operator === 'NOT_EMPTY') { checks.push(` meta$${rule.field} != ''`) }
          if (rule.operator === 'EQUALS') { checks.push(` meta$${rule.field} = ? `); replacements.push(rule.value) };
          if (rule.operator === 'REGEX') { checks.push(` meta$${rule.field} REGEXP ? `); replacements.push(rule.value) }
          if (rule.operator === 'BEFORE') { checks.push(` meta$${rule.field} > CAST(? AS DATE) `); replacements.push(rule.value) };
          if (rule.operator === 'AFTER') { checks.push(` meta$${rule.field} < CAST(? AS DATE) `); replacements.push(rule.value) };
          if (rule.operator === 'FROM') { checks.push(` meta$${rule.field} BETWEEN CAST(? AS DATE) AND CAST(? AS DATE)  `); replacements.push(rule.value.split('$')[0], rule.value.split('$')[1]) };
        })
        query += checks.join(` ${filter.combinator} `);
        query += ')'
      }
    });
  }

  // Basic fetch options
  query += `ORDER BY RAND() LIMIT ${limit} OFFSET ${offset} `

  // remove multiple spaces: just for the looks 😉
  query = query.replace(/  +/g, ' ');

  console.log({
    query,
    replacements
  })
  return {
    query,
    replacements
  }
}

// converts an object from database to key / value with all metadata
const getMetaDataFromDocument = (document: any): Record<string, any> => {
  const metaData: Record<string, any> = {}

  Object.keys(document).filter(e => e.startsWith('meta$')).forEach(meta => {
    Object.assign(metaData, {
      [meta.replace('meta$', '')]: document[meta]
    })
  })

  return metaData;
}

// list documents / used in querying collection.
export const getDocuments = async (modelId: number, filters: Filter[], limit = 1000, offset = 0): Promise<any> => {

  // fetch model to find table name
  const model = await ModelServices.getModel(modelId);

  const { query, replacements } = generateSelectQuery(filters, model.collectionName, limit, offset);

  console.log(query)
  const result = await sql.query(query, {
    replacements,
    type: QueryTypes.SELECT,
    logging: console.log
  });

  const obj: Record<string, any[]> = {}
  result.forEach((document: any) => {
    if (!obj[document.chunk]) {
      Object.assign(obj, { [document.chunk]: [document] })
    } else {
      obj[document.chunk].push(document);
    }
  })

  const data = Object.keys(obj).map(i => {
    const x = i.split('$')
    return {
      count: obj[i].length,
      vector: {
        x: parseInt(x[0], 10),
        y: parseInt(x[1], 10),
        z: parseInt(x[2], 10)
      },
      rows: obj[i].map(e => {
        return {
          id: e.id,
          name: e.name,
          vector3: {
            x: e.vector$x,
            y: e.vector$y,
            z: e.vector$z,
          }
        }
      })
    }
  })

  return {
    count: result.length,
    chunks: data
  }
}

export const getDocument = async (modelId: number, documentId: string) => {

  // Get top level model where this document exists
  const model = await ModelServices.getModel(modelId);

  // Read the document
  const documents = await sql.query("SELECT * FROM  `" + model.collectionName + "` WHERE id = ?", {
    replacements: [documentId],
    type: QueryTypes.SELECT
  });

  // Check if we actually recieved a document
  if (documents.length > 0) {
    const d = documents[0] as any;

    // Basic data mapping
    const result = {
      id: d.id,
      name: d.name,
      vector3: {
        x: d.vector$x,
        y: d.vector$y,
        z: d.vector$z
      },
    }

    // Metadata mapping
    Object.assign(result, { meta: getMetaDataFromDocument(d) })

    return result;
  }

  throw new Error('error/document-not-found')
}

export const syncModelToSql = async (vectorModel: VectorModel, sqlModel: ModelStatic<Model<any, any>>, mongoCollection: Collection<Document>, indexTask: IndexTask) => {
  try {
    const mappings = await vectorModel.getMappings();
    const meta = await vectorModel.getMeta();


    // Get data in mongodb nested objects --> Example headline.main
    const getDescendantProp = (obj: any, desc: string) => {
      return desc.split('.').reduce((a, b) => {
        return a[b];
      }, obj);
    }

    let documents: any[] = [];
    let recordsInserted = 0;



    // Creating a projection including default fields, metadata en cosine array
    // Saves bandwith since we do not fetch data we don't need
    const projection = {};

    mappings.forEach(e => {
      Object.assign(projection, {
        [e.value]: true
      })
    });

    meta.forEach(e => {
      Object.assign(projection, {
        [e.key]: true
      })
    });

    Object.assign(projection, {
      [vectorModel.cosineArray]: true
    });

    // Cursor over mongodb collection
    const cursor = mongoCollection.find({}, { projection });
    while (await cursor.hasNext()) {
      // This will fetch one document at a time
      const document = await cursor.next();
      // Basic mappings from mongodb to SQL model
      const obj = {
        id: document[mappings.find(e => e.key === 'id').value],
        name: getDescendantProp(document, mappings.find(e => e.key === 'name').value),
        ['vector$x']: document[mappings.find(e => e.key === 'vector3').value][0],
        ['vector$y']: document[mappings.find(e => e.key === 'vector3').value][1],
        ['vector$z']: document[mappings.find(e => e.key === 'vector3').value][2],
        cosineArray: document[vectorModel.cosineArray].join(',')
      }

      // Set every meta item in SQL model to meta$meta_key
      // pub_date becomes meta$pub_date in SQL model
      meta.forEach((metaItem) => {
        let value = document[metaItem.key];
        if (metaItem.type === 'date') {
          value = new Date(document[metaItem.key]).toISOString().substring(0, 10)
        }
        Object.assign(obj, {
          [`meta$${metaItem.key}`]: value
        })
      })


      documents.push(obj)

      // We bulk insert documents in groups of 1000 to SQL
      if (documents.length === 1000) {
        try {
          await sqlModel.bulkCreate(documents);
          recordsInserted += 1000
          // Update progress so you can follow progress
          await indexTask.update({ recordsInserted });

          // Cancel task
          const _task = await IndexTask.findByPk(indexTask.id);
          if (_task.state === TASK_STATE.CANCELED) {
            return;
          }
          documents = [];
        } catch (error) {
          console.log(error);
        }
      }
    }

    // When indexing is finished

    // Create index on vector data for faster querying
    await sql.query(`CREATE INDEX vector_index ON ${vectorModel.collectionName} (vector$x, vector$y, vector$z)`);
    // Create indexes on all meta fields that are dates for faster querying
    for (const dateMeta of meta.filter(e => e.type === 'date')) {
      await sql.query(`CREATE INDEX date_index_${dateMeta.key} ON ${vectorModel.collectionName} (meta$${dateMeta.key})`)
    }

    // Select averages of vectors to help set viewer in the middle of data
    const averages = await sql.query(`SELECT AVG(vector$x) as x, AVG(vector$y) as y, AVG(vector$z) as z  FROM ${vectorModel.collectionName};`, { type: QueryTypes.SELECT })
    if (averages[0]) {
      const a = averages[0] as Record<string, number>
      await vectorModel.update({
        center$x: a.x,
        center$y: a.y,
        center$z: a.z,
      })
    }

    // Set state to finshed
    await indexTask.update({
      state: TASK_STATE.FINISHED
    })

  } catch (error) {
    await indexTask.update({
      state: TASK_STATE.ERROR
    })
  }
}