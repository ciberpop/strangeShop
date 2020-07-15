import {NextFunction, Request, Response} from 'express';

import {ResponseStatusCodesEnum} from '../../constants';
import {customErrors, ErrorHandler} from '../../ErrorHandler';
import {userService} from '../../services/user';

export const checkIsEmailExistsMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void | NextFunction> => {
  const {email} = req.body;
  const userByEmail = await userService.findOneByParams({email});

  if (userByEmail) {
    return next(new ErrorHandler(
      customErrors.BAD_REQUEST_USER_REGISTERED.message,
      ResponseStatusCodesEnum.BAD_REQUEST,
      customErrors.BAD_REQUEST_USER_REGISTERED.code
    ));
  }

  next();
};
