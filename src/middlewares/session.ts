import { Request, Response, NextFunction} from 'express';
import { v4 as uuidv4 } from 'uuid';

const sessionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if(!req.cookies.session) res.cookie('session', uuidv4());
  next();
}

export default sessionMiddleware;