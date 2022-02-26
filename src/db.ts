import mongoose from 'mongoose';
import { Sequelize } from "sequelize";



// SQL SETUP
const config = {
  host: "141.94.222.96",
  user: "root",
  database: "lexica",
  password: "watchjs",
};

let queryCount = 0;
const db = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: 'mysql',
  logging: (msg) => {
    queryCount++;
  },
});


import VectorModel from './models/VectorModel';
import VectorModelMapping from './models/VectorModelMapping';
import VectorModelMeta from './models/VectorModelMeta';
import IndexTask from './models/IndexTask';


VectorModel.hasMany(VectorModelMeta, { as: 'meta'});
VectorModel.hasMany(VectorModelMapping, { as: 'mappings'})

VectorModel.hasOne(IndexTask);
// MONGO SETUP
const MONGODB_URL = process.env.MONGODB_URL;
const connectMongo = () => { return mongoose.connect(MONGODB_URL, { dbName: "nyt", user: "root", pass: "example" }) }

export {
  connectMongo,
  db,
};
