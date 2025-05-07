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
import { CreateDTO as SalaryCreateDTO } from "@/DTOs/Position/Salary/CreateDTO";
import { UpdateDTO as SalaryUpdateDTO } from "@/DTOs/Position/Salary/UpdateDTO";
import { CreateDTO as LeaveTypeCreateDTO } from './DTOs/LeaveType/CreateDTO';
import { UpdateDTO as LeaveTypeUpdateDTO } from './DTOs/LeaveType/UpdateDTO';
import { CreateDTO as EmployeeCreateDTO } from "@/DTOs/Employee/CreateDTO";
import { UpdateDTO as EmployeeUpdateDTO } from "@/DTOs/Employee/UpdateDTO";
import { PositionSalaryController } from './controllers/PositionSalaryController';
import { LeaveTypeController } from './controllers/LeaveTypeController';
import { EmployeeController } from './controllers/EmployeeController';

const router = Router();
const userController = new UserController();
const departmentController = new DepartmentController();
const positionController = new PositionController();
const positionSalaryController = new PositionSalaryController();
const leaveTypeController = new LeaveTypeController();
const employeeController = new EmployeeController();

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
router.put('/positions/update/:id', validateToken, commonValidation(PositionUpdateDTO), positionController.update);
router.delete('/positions/delete/:id', validateToken, positionController.delete);

router.get('/position/salaries', validateToken, positionSalaryController.index);
router.post('/position/salaries', validateToken, commonValidation(SalaryCreateDTO), positionSalaryController.store);
router.get('/position/salaries/view/:id', validateToken, positionSalaryController.show);
router.put("/position/salaries/update/:id", validateToken, commonValidation(SalaryUpdateDTO), positionSalaryController.update);
router.delete('/position/salaries/delete/:id', validateToken, positionSalaryController.delete);

router.get('/leave_types', validateToken, leaveTypeController.index);
router.post('/leave_types', validateToken, commonValidation(LeaveTypeCreateDTO), leaveTypeController.store);
router.get('/leave_types/view/:id', validateToken, leaveTypeController.show);
router.put('/leave_types/update/:id', validateToken, commonValidation(LeaveTypeUpdateDTO), leaveTypeController.update);
router.delete('/leave_types/delete/:id', validateToken, leaveTypeController.delete);

router.get('/employees', validateToken, employeeController.index);
router.post('/employees', validateToken, commonValidation(EmployeeCreateDTO), employeeController.store);
router.get('/employees/view/:id', validateToken, employeeController.show);
router.put('/employees/update/:id', validateToken, commonValidation(EmployeeUpdateDTO), employeeController.update);
router.delete('/employees/delete/:id', validateToken, employeeController.delete);

export default router;