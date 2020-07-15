import {Router} from 'express';

import {userController} from '../../controllers';
import {
  checkConfirmTokenMiddleware, checkForgotPassTokenMiddleware,
  checkIsEmailExistsMiddleware,
  checkIsUserExistsMiddleware,
  checkIsUserValidMiddleware,
  emailValidatorMiddleware,
  singlePasswordValidatorMiddleware
} from '../../middlewares';

const router = Router();

router.post('/', checkIsUserValidMiddleware, checkIsEmailExistsMiddleware, userController.createUser);
router.post('/confirm', checkConfirmTokenMiddleware, userController.confirmUser);
router.post('/password/forgot', emailValidatorMiddleware, checkIsUserExistsMiddleware, userController.forgotPassword);
router.post('/password/reset', singlePasswordValidatorMiddleware, checkForgotPassTokenMiddleware, userController.setForgotPassword);
router.get('/:userId', checkIsUserExistsMiddleware, userController.findOneByParams);

export const userRouter = router;
