import {verify, VerifyErrors} from 'jsonwebtoken';

import {promisify} from 'util';
import {ActionEnum, ResponseStatusCodesEnum} from '../constants';
import {customErrors, ErrorHandler} from '../ErrorHandler';
import {config} from '../config';

const verifyPromise = promisify(verify);

export const tokenVerifycator = async (action: ActionEnum, token: string): Promise<VerifyErrors | null> => {
  try {
    let isValid;

    switch (action) {
      // case ActionEnum.USER_AUTH:
      //   isValid = await verifyPromise(token, config.JWT_SECRET) as Promise<VerifyErrors | null>;
      //   break;

      case ActionEnum.USER_REGISTER:
        isValid = await verifyPromise(token, config.JWT_CONFIRM_EMAIL_SECRET) as Promise<VerifyErrors | null>;
        break;

      case ActionEnum.USER_FORGOT_PASSWORD:
        isValid = await verifyPromise(token, config.JWT_PASS_RESET_SECRET) as Promise<VerifyErrors | null>;
        break;

      default:
        throw new ErrorHandler('Wrong Action type', ResponseStatusCodesEnum.SERVER);
    }

    return isValid;
  } catch (e) {
    throw new ErrorHandler(customErrors.UNAUTHORIZED_BAD_TOKEN.message, ResponseStatusCodesEnum.UNAUTHORIZED);
  }
};
