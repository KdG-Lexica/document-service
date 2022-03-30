import { MongoClient } from 'mongodb'
import { Sequelize } from "sequelize";



// All database credentials should be provided as enviroment variables
// SQL SETUP
const config = {
  host: process.env.DB_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_PASSWORD,
};

let queryCount = 0;
const sql = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: 'mysql',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
  },
  logging: (msg) => {
    queryCount++;
  },
});


import VectorModel from './models/VectorModel';
import VectorModelMapping from './models/VectorModelMapping';
import VectorModelMeta from './models/VectorModelMeta';
import IndexTask from './models/IndexTask';

import IPTCMeta from './models/IPTCMeta';
import IPTCSet from './models/IPTCSet'
import { MongoCollection } from './dtos/model';
import ModelSessionPermisson from './models/ModelSessionPermission';

VectorModel.hasMany(VectorModelMeta, { as: 'meta' });
VectorModel.hasMany(VectorModelMapping, { as: 'mappings' })
VectorModel.hasOne(IndexTask);
VectorModel.hasMany(ModelSessionPermisson);

IPTCSet.hasMany(IPTCMeta);


let mongoClient: null | MongoClient = null;


const connectMongo = async (mongo: MongoCollection): Promise<MongoClient> => {
  if(!mongoClient){
    if(mongo.srv){
      mongoClient = new MongoClient(`mongodb+srv://${mongo.host}`, { auth: { username: mongo.username, password: mongo.password } });
    } else {
      mongoClient = new MongoClient(`mongodb://${mongo.host}:${mongo.port}`, { auth: { username: mongo.username, password: mongo.password } });
    }
    return mongoClient.connect();
  }

  return mongoClient;
};


export {
  sql,
  connectMongo
};
