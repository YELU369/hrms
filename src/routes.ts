import { Router, Request, Response } from 'express';
import { UserController } from './controllers/UserController';
import { commonValidation } from './middlewares/validateDTO';
import { UserLoginDTO } from './DTOs/UserLoginDTO';
import { UserRegisterDTO } from './DTOs/UserRegisterDTO';
import { ForgotPasswordDTO } from './DTOs/ForgotPasswordDTO';
import { PasswordResetDTO } from './DTOs/PasswordResetDTO';
import { validateToken } from './middlewares/validateToken';
import { DepartmentController } from './controllers/DepartmentController';
import { PositionController } from './controllers/PositionController';
import { CreateDTO as DeptCreateDTO } from './DTOs/Department/CreateDTO';
import { UpdateDTO as DeptUpdateDTO } from './DTOs/Department/UpdateDTO';
import { CreateDTO as PositionCreateDTO } from './DTOs/Position/CreateDTO';
import { UpdateDTO as PositionUpdateDTO } from './DTOs/Position/UpdateDTO';

const router = Router();
const userController = new UserController();
const departmentController = new DepartmentController();
const positionController = new PositionController();

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

router.get('/departments', validateToken, departmentController.index);
router.post('/departments', validateToken, commonValidation(DeptCreateDTO), departmentController.store);
router.get('/departments/view/:id', validateToken, departmentController.show);
router.put('/departments/update/:id', validateToken, commonValidation(DeptUpdateDTO), departmentController.update);
router.delete('/departments/delete/:id', validateToken, departmentController.delete);

router.get('/positions', validateToken, positionController.index);
router.post('/positions', validateToken, commonValidation(PositionCreateDTO), positionController.store);
router.get('/positions/view/:id', validateToken, positionController.show);
router.put("/positions/update/:id", validateToken, commonValidation(PositionUpdateDTO), positionController.update);
router.delete('/positions/delete/:id', validateToken, positionController.delete);

export default router;