import {ActionEnum} from '../constants';

export const htmlTemplates: {[index: string]: {subject: string, templateFileName: string}} = {
  [ActionEnum.USER_REGISTER]: {
    subject: '[Strange Shop] Вітаємо на нашому сайті!',
    templateFileName: 'user-confirmed'
  },
  [ActionEnum.USER_FORGOT_PASSWORD]: {
    subject: '[Strange Shop] Відновлення паролю',
    templateFileName: 'forgot-password'
  }
};
