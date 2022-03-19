import express, { NextFunction, Request, Response } from 'express';
import { json, urlencoded } from 'body-parser';
import * as cors from 'cors';
import { HandleError } from './controllers/ErrorController';
import { HttpException } from './exceptions/HttpException';
import 'dotenv/config'

import { sql } from './db';

const app = express();
const PORT = process.env.PORT as unknown as number || 3000;
// Middlewares
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors.default());

app.get('/api/health', (req: Request, res: Response) => {
  return res.status(200).json({
    version: '1.0.0'
  });
})

import ModelRouter from './routes/ModelRouter';
import IPTCRouter from './routes/IPTCRouter';

app.use('/api/models', ModelRouter);
app.use('/api/iptc', IPTCRouter);


app.use((req: Request, res: Response, next: NextFunction) => next(new HttpException(404, "not-found")));
app.use((error: HttpException, req: Request, res: Response, next: NextFunction) => {
  HandleError(error, req, res, next)
});

sql.sync({alter: true}).then(() => {
  app.listen(PORT, () => {
    console.log(`API running on port ${PORT}!`);
  });
})
