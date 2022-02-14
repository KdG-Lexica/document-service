import mongoose from 'mongoose';
// const MONGODB_URL = process.env.MONGODB_URL;
console.log(process.env.MONGODB_URL);
export default mongoose.connect(process.env.MONGODB_URL, { dbName: 'nyt', user: 'root', pass: 'example' });
/* export const db = mongoose.connection; */
