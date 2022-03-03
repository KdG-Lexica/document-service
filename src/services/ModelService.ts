import VectorModel, { VectorModelAttributes } from '../models/VectorModel';
import VectorModelMapping, { VectorModelMappingAttributes } from '../models/VectorModelMapping';
import VectorModelMeta, { VectorModelMetaAttributes } from '../models/VectorModelMeta';
import IndexTask from '../models/IndexTask';

import { db } from '../db';
import { DataTypes, Model, ModelStatic } from 'sequelize';

import * as DocumentService from './DocumentService';
import * as IndexTaskService from './IndexTaskService';



const generateColumns = (meta: VectorModelMeta[]): any => {
  const cols = {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING },
    date: { type: DataTypes.STRING },
    ['vector$x']: { type: DataTypes.DOUBLE },
    ['vector$y']: { type: DataTypes.DOUBLE },
    ['vector$z']: { type: DataTypes.DOUBLE },
    cosineArray: { type: DataTypes.TEXT },
  }

  meta.forEach(metaItem => {
    Object.assign(cols, {
      [`meta$${metaItem.key}`]: DataTypes.STRING
    })
  })

  return cols;
}

const createSqlModel = async (model: VectorModel): Promise<ModelStatic<Model<any, any>>> => {
  const meta = await model.getMeta();
  const cols = generateColumns(meta);

  const sqlModel = await db.define(model.collectionName, cols, {
    tableName: model.collectionName,
  })

  await sqlModel.sync();


  return sqlModel;
}

export const initModel = async (collectionName: string, cosineArray: string, mappings: Record<string, string>, meta: VectorModelMetaAttributes[]): Promise<IndexTask> => {

  const name = `${collectionName}_${(Math.random() + 1).toString(36).substring(7)}`
  const vectorModel = await VectorModel.create({
    collectionName: name,
    cosineArray,
  })


  for (const [key, value] of Object.entries(mappings)) {
    await VectorModelMapping.create({
      VectorModelId: vectorModel.id,
      key,
      value,
    })
  }

  for (const metaItem of meta) {
    await VectorModelMeta.create({
      VectorModelId: vectorModel.id,
      ...metaItem
    })
  }

  const collectionCount = await DocumentService.countCollection(vectorModel.collectionName.split('_')[0]);
  console.log(`Collection count: ${collectionCount}`)
  const indexTask = await IndexTaskService.createIndexTask({
    VectorModelId: vectorModel.id,
    estimatedComplete: new Date(),
    recordCount: collectionCount,
    recordsInserted: 0
  })

  const sqlModel = await createSqlModel(vectorModel);
  DocumentService.syncModelToSql(vectorModel, sqlModel, indexTask);

  return indexTask;
}

export const getModel = async (modelId: number): Promise<VectorModel> => {
  return VectorModel.findByPk(modelId, {
    include: [
      {
        model: VectorModelMapping,
        attributes: { include: ['key', 'value'] },
        as: 'mappings'
      },
      {
        model: VectorModelMeta,
        attributes: { include: ['key', 'type', 'name'] },
        as: 'meta'
      }
    ]
  })
}

export const getModels = () => {
  return VectorModel.findAll({
    include: [{
      model: VectorModelMapping,
      attributes: { include: ['key', 'value'] },
      as: 'mappings'
    },
    {
      model: VectorModelMeta,
      attributes: { include: ['key', 'type', 'name'] },
      as: 'meta'
    }]
  })
}

export const updateModel = (model: Partial<VectorModelAttributes>) => {
  return VectorModel.update(model, {
    where: {
      id: model.id
    }
  })
}

export const deleteModel = (modelId: string) => {
  return VectorModel.destroy({
    where: {
      id: modelId
    }
  });
}
