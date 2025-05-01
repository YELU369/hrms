import { Router, Request, Response } from 'express';
import { UserController } from './controllers/UserController';
import { commonValidation } from './middlewares/validateDTO';
import { UserLoginDTO } from './DTOs/UserLoginDTO';
import { UserRegisterDTO } from './DTOs/UserRegisterDTO';
import { ForgotPasswordDTO } from './DTOs/ForgotPasswordDTO';
import { PasswordResetDTO } from './DTOs/PasswordResetDTO';
import { validateToken } from './middlewares/validateToken';

const router = Router();
const userController = new UserController();

router.get('/', (request: Request, response: Response): void => {
  response.status(200).send('Hello World with TypeScript!');
});

router.post('/signup', commonValidation(UserRegisterDTO), userController.signup);
router.post('/login', commonValidation(UserLoginDTO), userController.login);
router.get('/verify/:token', userController.verify);
router.post('/forgot-password', commonValidation(ForgotPasswordDTO), userController.forgotPassword);
router.get('/reset-password/:token', userController.showResetForm);
router.post('/reset-password/:token', commonValidation(PasswordResetDTO), userController.resetPassword);
router.post('/logout', validateToken,  userController.logOut);
router.get('/profile', validateToken,  userController.profile);

export default router;