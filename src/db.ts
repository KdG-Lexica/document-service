import mongoose from 'mongoose';
import { Sequelize } from "sequelize";



// SQL SETUP
const config = {
  host: process.env.production === 'yes' ? 'mysql' : "141.94.222.96",
  user: process.env.production === 'yes' ? process.env.MYSQL_USER : "root",
  database: process.env.production === 'yes' ? process.env.DATABASE : "lexica",
  password: process.env.production === 'yes' ? process.env.MYSQL_PASSWORD : "watchjs",
};

let queryCount = 0;
const db = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: 'mysql',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
  },
  logging: (msg) => {
    console.log(msg);
    queryCount++;
  },
});


import VectorModel from './models/VectorModel';
import VectorModelMapping from './models/VectorModelMapping';
import VectorModelMeta from './models/VectorModelMeta';
import IndexTask from './models/IndexTask';

import IPTCMeta from './models/IPTCMeta';
import IPTCSet from './models/IPTCSet'

VectorModel.hasMany(VectorModelMeta, { as: 'meta'});
VectorModel.hasMany(VectorModelMapping, { as: 'mappings'})

VectorModel.hasOne(IndexTask);

IPTCSet.hasMany(IPTCMeta);


// MONGO SETUP
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://mongodb.verhelst.dev:27017";
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'nyt' 
const MONGODB_USER = process.env.MONGO_USERNAME || 'root';
const MONGODB_PASSWORD = process.env.MONGO_PASSWORD || 'example'
const connectMongo = () => { return mongoose.connect(MONGODB_URL, { dbName: MONGODB_DB_NAME, user: MONGODB_USER , pass: MONGODB_PASSWORD }) }
mongoose.set('debug', { shell: true })
export {
  connectMongo,
  db,
};
