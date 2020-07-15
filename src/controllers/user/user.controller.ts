import {NextFunction, Request, Response} from 'express';
import * as Joi from 'joi';

import {ActionEnum, LogEnum, ResponseStatusCodesEnum, UserStatusEnum} from '../../constants';
import {hashPassword, tokenizer} from '../../helpers';
import {IRequestExtended, IUser} from '../../models';
import {UserModel} from '../../database/models';
import {newUserValidator} from '../../validators';
import {emailService, logService, userService} from '../../services';
import {customErrors, ErrorHandler} from '../../ErrorHandler';

class UserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    const user = req.body as IUser;
    const {error} = Joi.validate(user, newUserValidator);

    user.password = await hashPassword(user.password);

    if (error) {
      return next(new Error(error.details[0].message));
    }

    const {_id} = await userService.createUser(user);

    const {access_token} = tokenizer(ActionEnum.USER_REGISTER);

    await userService.addActionToken(_id, {action: ActionEnum.USER_REGISTER, token: access_token});
    await emailService.sendEmail(user.email, ActionEnum.USER_REGISTER, {token: access_token});
    await logService.createLog({event: LogEnum.USER_REGISTERED, userId: _id});

    res.json(ResponseStatusCodesEnum.CREATED);
  }

  async confirmUser(req: IRequestExtended, res: Response, next: NextFunction) {
    const {_id, status, tokens = []} = req.user as IUser;
    const tokenToDelete = req.get('Authorization');

    if (status !== UserStatusEnum.PENDING) {
      return next(
        new ErrorHandler(
          customErrors.BAD_REQUEST_USER_ACTIVATED.message,
          ResponseStatusCodesEnum.BAD_REQUEST,
          customErrors.BAD_REQUEST_USER_ACTIVATED.code)
      );
    }

    await userService.updateUserByParams({_id}, {status: UserStatusEnum.CONFIRMED});

    const index = tokens.findIndex(({action, token}) => {
      return token === tokenToDelete && action === ActionEnum.USER_REGISTER;
    });

    if (index !== -1) {
      tokens.splice(index, 1);

      await userService.updateUserByParams({_id}, {tokens} as Partial<IUser>);
    }

    await logService.createLog({event: LogEnum.USER_CONFIRMED, userId: _id});
    res.end();
  }

  async findOneByParams(req: Request, res: Response, next: NextFunction){
    const {_id} = req.params;
    const user = req.body;

    await UserModel.findOne({_id});

    res.json(user);
  }

  async forgotPassword(req: IRequestExtended, res: Response, next: NextFunction) {
    const {_id, email} = req.user as IUser;
    const {access_token} = tokenizer(ActionEnum.USER_FORGOT_PASSWORD);

    await userService.addActionToken(_id, {token: access_token, action: ActionEnum.USER_FORGOT_PASSWORD});
    await emailService.sendEmail(email, ActionEnum.USER_FORGOT_PASSWORD, {token: access_token});

    res.end();
  }

  async setForgotPassword(req: IRequestExtended, res: Response, next: NextFunction) {
    const {_id, tokens = []} = req.user as IUser;
    const {password} = req.body;
    const tokenToDelete = req.get('Authorization');
    const hashPass = await hashPassword(password);

    await userService.updateUserByParams({_id}, {password: hashPass});

    const index = tokens.findIndex(({action, token}) => {
      return token === tokenToDelete && action === ActionEnum.USER_FORGOT_PASSWORD;
    });

    if (index !== -1) {
      tokens.splice(index, 1);

      await userService.updateUserByParams({_id}, {tokens} as Partial<IUser>);
    }

    res.end();
  }
}

export const userController = new UserController();
