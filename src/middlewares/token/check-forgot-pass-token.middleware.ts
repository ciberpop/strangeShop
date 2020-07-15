import {NextFunction, Response} from 'express';

import {ActionEnum, ResponseStatusCodesEnum} from '../../constants';
import {customErrors, ErrorHandler} from '../../ErrorHandler';
import {tokenVerifycator} from '../../helpers';
import {IRequestExtended} from '../../models';
import {userService} from '../../services';

export const checkForgotPassTokenMiddleware =
  async (req: IRequestExtended, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.get('Authorization');

      if (!token) {
        return next(new ErrorHandler(customErrors.BAD_REQUEST_NO_TOKEN.message, ResponseStatusCodesEnum.BAD_REQUEST));
      }
      await tokenVerifycator(ActionEnum.USER_FORGOT_PASSWORD, token);

      const userByToken = await userService.findUserByActionToken(ActionEnum.USER_REGISTER, token);

      if (!userByToken) {
        return next(new ErrorHandler(customErrors.NOT_FOUND.message, ResponseStatusCodesEnum.NOT_FOUND));
      }

      req.user = userByToken;

      next();
    } catch (e) {
      next(e);
    }
  };
