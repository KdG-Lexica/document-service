import express, { NextFunction, Request, Response } from 'express';
import { json, urlencoded } from 'body-parser';
import * as cors from 'cors';
import { HandleError } from './controllers/ErrorController';
import { HttpException } from './exceptions/HttpException';
import 'dotenv/config'
import db, { applyMongooseCache } from './db';
import ArticleRoute from './routes/ArticleRoutes';
const app = express();
const PORT = process.env.PORT as unknown as number || 3000;

// Middlewares
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors.default());

const getDurationInMilliseconds = (start: any) => {
  const NS_PER_SEC = 1e9
  const NS_TO_MS = 1e6
  const diff = process.hrtime(start)

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} [STARTED]`)
  const start = process.hrtime()

  res.on('finish', () => {
      const durationInMilliseconds = getDurationInMilliseconds (start)
      console.log(`${req.method} ${req.originalUrl} [FINISHED] ${durationInMilliseconds.toLocaleString()} ms`)
  })

  res.on('close', () => {
      const durationInMilliseconds = getDurationInMilliseconds (start)
      console.log(`${req.method} ${req.originalUrl} [CLOSED] ${durationInMilliseconds.toLocaleString()} ms`)
  })

  next()
})


app.get('/api/health', (req: Request, res: Response) => {
  return res.status(200).json({
    version: '0.0.1'
  });
})

app.use('/articles', ArticleRoute)
app.use((req: Request, res: Response, next: NextFunction) => next(new HttpException(404, "not-found")));
app.use((error: HttpException, req: Request, res: Response, next: NextFunction) => {
  HandleError(error, req, res, next)
});

applyMongooseCache().then(() => {
  db.then(() => {
    app.listen(PORT, () => {
      console.log(`API running on port ${PORT}!`);
    });
  })
})


