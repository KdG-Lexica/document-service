import mongoose from 'mongoose';

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