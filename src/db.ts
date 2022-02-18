import mongoose from 'mongoose';
const MONGODB_URL = process.env.MONGODB_URL;
const IS_PRODUCTION = process.env.enviroment === 'prod';

import { createClient } from 'redis'

export const applyMongooseCache = async () => {
  if (IS_PRODUCTION) {
    const client = createClient({url: 'redis://redis:6379'})
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

      if (cacheValue) {
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

}

const connectDatabase = mongoose.connect(MONGODB_URL, { dbName: "nyt", user: "root", pass: "example" });

export {
  connectDatabase
};
/* export const db = mongoose.connection; */
