import * as ModelService from './ModelService';

import { sql } from '../db';
import Vector3Type from '../dtos/vector3';
import { QueryTypes } from 'sequelize';

let x = 0;
// Cosine simmilarity function
const cosinesim = (A: number[], B: number[]) => {
  let dotproduct = 0;
  let mA = 0;
  let mB = 0;
  let i = 0
  const len = A.length;
  // Fun fact, faster then for loop
  while (i < len) {
    dotproduct += (A[i] * B[i]);
    mA += (A[i] * A[i]);
    mB += (B[i] * B[i]);
    i++
  };

  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  const similarity = (dotproduct) / ((mA) * (mB));
  console.timeEnd('cosine-calc-' + x)
  x++;
  return similarity;
}

const generateQuery = (collectionName: string, rangeFactor: number, modelVector: Vector3Type): string => {
  return `SELECT id, name, vector$x, vector$y, vector$z, cosineArray FROM ${collectionName} WHERE (vector$y > ${modelVector.y - rangeFactor / 2} AND vector$y < ${modelVector.y + rangeFactor / 2}) AND (vector$z > ${modelVector.z - rangeFactor / 2} AND vector$z < ${modelVector.z + rangeFactor / 2}) AND (vector$x > ${modelVector.x - rangeFactor / 2} AND vector$x < ${modelVector.x + rangeFactor / 2});`
}

export const GetCosineCloseDocuments = async (modelId: number, documentId: string, rangeFactor: number) => {
  const data: any[] = [];
  const model = await ModelService.getModel(modelId);

  // document to compare
  const document: any = (await sql.query(`SELECT * FROM ${model.collectionName} WHERE id = ?`, { replacements: [documentId], type: QueryTypes.SELECT }))[0]

  const query = generateQuery(model.collectionName, rangeFactor, {
    x: document.vector$x,
    y: document.vector$y,
    z: document.vector$z,
  })

  // documents that are close based on 3d vector
  const documents = (await sql.query(query, { type: QueryTypes.SELECT })) as any[];

  const ca = document.cosineArray.split(',').map(Number)
  for (const doc of documents) {
    console.time('cosine-calc-' + x);
    // @ts-ignore
    const cosine = doc.cosineArray.split(',').map(Number)
    // @ts-ignore
    delete doc.cosineArray

    const d = {
      id: doc.id,
      name: doc.name,
      vector3: {
        x: doc.vector$x,
        y: doc.vector$y,
        z: doc.vector$z
      }
    }

    data.push({
      cosine: cosinesim(ca, cosine),
      doc: d,
    })
  }

  return { count: data.length, rows: data.sort((a, b) => b.cosine - a.cosine) }
}