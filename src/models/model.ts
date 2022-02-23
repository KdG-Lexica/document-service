import mongoose from 'mongoose';

export interface MetaProperty {
  value: string,
  type: string
}

export interface ModelProperties {
  _id: string,
  collectionName: string,
  meta: MetaProperty[],
  mappings: {
    id: string,
    name: string,
    date: string,
    vector3: string,
  }
}

const modelSchema = new mongoose.Schema({
  collectionName: String,
  meta: [],
  mappings : {
    id: String,
    name: String,
    date: String,
    vector3: String,
  }
})

const Model = mongoose.model('models', modelSchema);

export default Model;