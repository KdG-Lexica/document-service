import VectorModel, { VectorModelAttributes } from '../models/VectorModel';
import VectorModelMapping, { VectorModelMappingAttributes } from '../models/VectorModelMapping';
import VectorModelMeta, { VectorModelMetaAttributes } from '../models/VectorModelMeta';
import IndexTask, { TASK_STATE } from '../models/IndexTask';

import { sql, connectMongo } from '../db';
import { DataTypes, Model, ModelStatic } from 'sequelize';

import * as DocumentService from './DocumentService';
import * as IndexTaskService from './IndexTaskService';
import * as PermissionService from './PermissionServices';

import { CreateModelDto, ModelDto } from '../dtos/model';

import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';


const generateColumns = (meta: VectorModelMeta[]): any => {
  const cols = {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.TEXT },
    vector$x: { type: DataTypes.DOUBLE },
    vector$y: { type: DataTypes.DOUBLE },
    vector$z: { type: DataTypes.DOUBLE },
    cosineArray: { type: DataTypes.TEXT },
    chunk: {
      type: "VARCHAR(255) GENERATED ALWAYS as (CONCAT(FLOOR(vector$x), '$', FLOOR(vector$y), '$', FLOOR(vector$z)))",
      set() {
        throw new Error('generatedValue is read-only')
      }
    },
  }


  // Saving metadata in columms like 'meta$key'
  // For example metadata pub_date becomes column meta$pub_date
  meta.forEach(metaItem => {

    // Checking on type of metadata and setting column type
    switch (metaItem.type) {
      case 'date': {
        Object.assign(cols, {
          [`meta$${metaItem.key}`]: DataTypes.DATE
        })
        break;
      }
      case 'string': {
        Object.assign(cols, {
          [`meta$${metaItem.key}`]: DataTypes.TEXT
        })
        break;
      };
      case 'number': {
        Object.assign(cols, {
          [`meta$${metaItem.key}`]: DataTypes.INTEGER
        })
        break;
      }
    }
  })

  return cols;
}

const createSqlModel = async (model: VectorModel): Promise<ModelStatic<Model<any, any>>> => {

  const meta = await model.getMeta();
  const cols = generateColumns(meta);

  const sqlModel = sql.define(model.collectionName, cols, {
    tableName: model.collectionName,
  });

  await sqlModel.sync();


  return sqlModel;
}

export const initModel = async (props: CreateModelDto): Promise<IndexTask> => {
  try {
    const mongoClient = await connectMongo(props.mongoCollection)
    const mongoCollection = mongoClient.db(props.mongoCollection.db).collection(props.mongoCollection.collection);

    const collectionCount = await mongoCollection.countDocuments();

    const sqlTableName = uuidv4();

    const vectorModel = await VectorModel.create({
      collectionName: sqlTableName,
      cosineArray: props.cosineArray,
      description: props.description,
      documentCount: collectionCount,
      title: props.title,
      hash: props.password.length === 0 ? null : await bcrypt.hash(props.password, 10)
    })

    for (const [key, value] of Object.entries(props.mappings)) {
      await VectorModelMapping.create({
        VectorModelId: vectorModel.id,
        key,
        value,
      })
    }

    for (const metaItem of props.meta) {
      await VectorModelMeta.create({
        VectorModelId: vectorModel.id,
        ...metaItem
      })
    }

    const indexTask = await IndexTaskService.createIndexTask({
      VectorModelId: vectorModel.id,
      recordCount: collectionCount,
      recordsInserted: 0,
      state: TASK_STATE.RUNNING
    })

    const sqlModel = await createSqlModel(vectorModel);
    DocumentService.syncModelToSql(vectorModel, sqlModel, mongoCollection, indexTask);

    return indexTask;

  } catch (error) {
    throw error;
  }

}

export const getModel = async (modelId: number): Promise<ModelDto> => {
  const model = await VectorModel.findByPk(modelId, {
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
  
  // Basic mapping
  return {
    center: {
      x: model.center$x,
      y: model.center$y,
      z: model.center$z
    },
    collectionName: model.collectionName,
    cosineArray: model.cosineArray,
    description: model.description,
    documentCount: model.documentCount,
    mappings: model.mappings,
    meta: model.meta,
    id: model.id,
    title: model.title,
    requiresPassword: model.hash !== null,
    unlocked: true,
  }
}

export const getModels = async (sessionKey: string): Promise<ModelDto[]> => {
  const models = await VectorModel.findAll({
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

  if(sessionKey.length === 0){
    return models.map(model => {
      return {
        center: {
          x: model.center$x,
          y: model.center$y,
          z: model.center$z
        },
        collectionName: model.collectionName,
        cosineArray: model.cosineArray,
        description: model.description,
        documentCount: model.documentCount,
        mappings: model.mappings,
        meta: model.meta,
        id: model.id,
        title: model.title,
        requiresPassword: model.hash !== null,
        unlocked: true
      }
    })
  }
  
  const permissions = await PermissionService.getAllowedModelsForSession(sessionKey);

  return models.map(model => {
    return {
      center: {
        x: model.center$x,
        y: model.center$y,
        z: model.center$z
      },
      collectionName: model.collectionName,
      cosineArray: model.cosineArray,
      description: model.description,
      documentCount: model.documentCount,
      mappings: model.mappings,
      meta: model.meta,
      id: model.id,
      title: model.title,
      requiresPassword: model.hash !== null,
      unlocked: model.hash === null ? true : (permissions.find(e => e.VectorModelId === model.id) ? true : false),
    }
  })
}

export const updateModel = (model: Partial<VectorModelAttributes>) => {
  return VectorModel.update(model, {
    where: {
      id: model.id
    }
  })
}

export const deleteModel = async (modelId: number) => {
  const model = await VectorModel.findByPk(modelId);

  if (!model) throw new Error('error/model-not-found');

  await sql.query(`DROP TABLE ${model.collectionName};`)
  await model.destroy();
}
