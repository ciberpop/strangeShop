import {NextFunction, Response} from 'express';

import {ResponseStatusCodesEnum} from '../../constants';
import {customErrors, ErrorHandler} from '../../ErrorHandler';
import {userService} from '../../services/user';
import {IRequestExtended} from '../../models';

export const checkIsUserExistsMiddleware =
  async (req: IRequestExtended, res: Response, next: NextFunction): Promise<void | NextFunction> => {
    const {email} = req.body;
    const userByEmail = await userService.findOneByParams({email});

    if (!userByEmail) {
      return next(new ErrorHandler(
        customErrors.NOT_FOUND.message,
        ResponseStatusCodesEnum.NOT_FOUND
      ));
    }

    req.user = userByEmail;

    next();
  };
