import mongoose from 'mongoose';
const MONGODB_URL = process.env.MONGODB_URL;

import { createClient } from 'redis'

export const applyMongooseCache = async () => {

  const client = process.env.enviroment === 'prod' ? createClient({ url: 'redis://redis'})  :createClient()
  await client.connect()
  const exec = mongoose.Query.prototype.exec

  mongoose.Query.prototype.exec = async function () {
    const key = JSON.stringify(
      {
        ...this.getQuery(),
        collection: this.mongooseCollection.name,
        op: this.op,
        options: this.options
      }
    )
      
    const cacheValue = await client.get(key)

    if (cacheValue){
      console.log('Cache HIT')
      return JSON.parse(cacheValue)
    }
    console.log('Cache MISS')

    const result = await exec.apply(this, arguments)

    if (result) {
      await client.set(key, JSON.stringify(result))
    }
    return result
  }
}

const connection = mongoose.connect(MONGODB_URL, { dbName: "nyt", user: "root", pass: "example" });

export default connection;
/* export const db = mongoose.connection; */
