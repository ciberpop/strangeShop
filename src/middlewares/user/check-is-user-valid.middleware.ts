import {NextFunction, Request, Response} from 'express';
import * as Joi from 'joi';

import {newUserValidator} from '../../validators/user';
import {ErrorHandler} from '../../ErrorHandler';
import {ResponseStatusCodesEnum} from '../../constants';

export const checkIsUserValidMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const {error} = Joi.validate(req.body, newUserValidator);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, ResponseStatusCodesEnum.BAD_REQUEST));
  }

  next();
};
