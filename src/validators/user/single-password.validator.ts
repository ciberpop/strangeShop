import * as Joi from 'joi';

import {RegExpEnum} from '../../constants';

export const singlePasswordValidator = Joi.object({
  password: Joi.string().trim().regex(RegExpEnum.password).required()
});
