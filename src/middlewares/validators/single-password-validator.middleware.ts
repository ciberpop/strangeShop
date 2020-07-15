import {NextFunction, Request, Response} from 'express';
import * as Joi from 'joi';

import {singlePasswordValidator} from '../../validators/user';
import {ErrorHandler} from '../../ErrorHandler';
import {ResponseStatusCodesEnum} from '../../constants';

export const singlePasswordValidatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const {error} = Joi.validate(req.body, singlePasswordValidator);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, ResponseStatusCodesEnum.BAD_REQUEST));
  }

  next();
};
