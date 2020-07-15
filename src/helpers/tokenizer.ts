import * as jwt from 'jsonwebtoken';

import {ActionEnum, ResponseStatusCodesEnum} from '../constants';
import {config} from '../config';
import {ErrorHandler} from '../ErrorHandler';

export const tokenizer = (action: ActionEnum): {access_token: string, refresh_token: string} => {
  let access_token = '';
  const refresh_token = '';

  switch (action) {
    case ActionEnum.USER_REGISTER:
      access_token = jwt.sign(
        {},
        config.JWT_CONFIRM_EMAIL_SECRET,
        {expiresIn: config.JWT_CONFIRM_EMAIL_LIFETIME}
      );
      break;

    case ActionEnum.USER_FORGOT_PASSWORD:
      access_token = jwt.sign(
        {},
        config.JWT_PASS_RESET_SECRET,
        {expiresIn: config.JWT_PASS_RESET_LIFETIME}
      );
      break;

    default:
      throw new ErrorHandler('Wrong action type', ResponseStatusCodesEnum.SERVER);

  }

  return {
    access_token,
    refresh_token
  };
};
