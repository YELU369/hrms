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
import { CreateDTO as WorkScheduleCreateDTO } from "@/DTOs/WorkSchedule/CreateDTO";
import { UpdateDTO as WorkScheduleUpdateDTO } from "@/DTOs/WorkSchedule/UpdateDTO";
import { CreateDTO as ManagerCreateDTO } from "@/DTOs/Department/Manager/CreateDTO";
import { UpdateDTO as ManagerUpdateDTO } from "@/DTOs/Department/Manager/UpdateDTO";
import { CreateDTO as HolidayCreateDTO } from './DTOs/Holiday/CreateDTO';
import { UpdateDTO as HolidayUpdateDTO } from './DTOs/Holiday/UpdateDTO';
import { PositionSalaryController } from './controllers/PositionSalaryController';
import { LeaveTypeController } from './controllers/LeaveTypeController';
import { EmployeeController } from './controllers/EmployeeController';
import { OfficeHourController } from './controllers/OfficeHourController';
import { WorkScheduleController } from './controllers/WorkScheduleController';
import { DepartmentManagerController } from './controllers/DepartmentManagerController';
import { HolidayController } from './controllers/HolidayController';

const router = Router();
const userController = new UserController();
const departmentController = new DepartmentController();
const positionController = new PositionController();
const positionSalaryController = new PositionSalaryController();
const leaveTypeController = new LeaveTypeController();
const employeeController = new EmployeeController();
const officeHourController = new OfficeHourController();
const workScheduleController = new WorkScheduleController();
const departmentManagerController = new DepartmentManagerController();
const holidayController = new HolidayController();

router.get('/', (request: Request, response: Response): void => {
  response.status(200).send('Hello World with TypeScript!');
});

router.post('/signup', commonValidation(UserRegisterDTO), userController.signup.bind(userController));
router.post('/login', commonValidation(UserLoginDTO), userController.login.bind(userController));
router.get('/verify/:token', userController.verify.bind(userController));
router.post('/forgot-password', commonValidation(ForgotPasswordDTO), userController.forgotPassword.bind(userController));
router.get('/reset-password/:token', userController.showResetForm.bind(userController));
router.post('/reset-password/:token', commonValidation(PasswordResetDTO), userController.resetPassword.bind(userController));
router.post('/logout', validateToken,  userController.logOut.bind(userController));
router.get('/profile', validateToken,  userController.profile.bind(userController));

router.get('/departments', validateToken, departmentController.index.bind(departmentController));
router.post('/departments', validateToken, commonValidation(DeptCreateDTO), departmentController.store.bind(departmentController));
router.get('/departments/view/:id', validateToken, departmentController.show.bind(departmentController));
router.put('/departments/update/:id', validateToken, commonValidation(DeptUpdateDTO), departmentController.update.bind(departmentController));
router.delete('/departments/delete/:id', validateToken, departmentController.delete.bind(departmentController));

router.get('/positions', validateToken, positionController.index.bind(positionController));
router.post('/positions', validateToken, commonValidation(PositionCreateDTO), positionController.store.bind(positionController));
router.get('/positions/view/:id', validateToken, positionController.show.bind(positionController));
router.put('/positions/update/:id', validateToken, commonValidation(PositionUpdateDTO), positionController.update.bind(positionController));
router.delete('/positions/delete/:id', validateToken, positionController.delete.bind(positionController));

router.get('/position/salaries', validateToken, positionSalaryController.index.bind(positionSalaryController));
router.post('/position/salaries', validateToken, commonValidation(SalaryCreateDTO), positionSalaryController.store.bind(positionSalaryController));
router.get('/position/salaries/view/:id', validateToken, positionSalaryController.show.bind(positionSalaryController));
router.put("/position/salaries/update/:id", validateToken, commonValidation(SalaryUpdateDTO), positionSalaryController.update.bind(positionSalaryController));
router.delete('/position/salaries/delete/:id', validateToken, positionSalaryController.delete.bind(positionSalaryController));

router.get('/leave_types', validateToken, leaveTypeController.index.bind(leaveTypeController));
router.post('/leave_types', validateToken, commonValidation(LeaveTypeCreateDTO), leaveTypeController.store.bind(leaveTypeController));
router.get('/leave_types/view/:id', validateToken, leaveTypeController.show.bind(leaveTypeController));
router.put('/leave_types/update/:id', validateToken, commonValidation(LeaveTypeUpdateDTO), leaveTypeController.update.bind(leaveTypeController));
router.delete('/leave_types/delete/:id', validateToken, leaveTypeController.delete.bind(leaveTypeController));

router.get('/employees', validateToken, employeeController.index.bind(employeeController));
router.post('/employees', validateToken, commonValidation(EmployeeCreateDTO), employeeController.store.bind(employeeController));
router.get('/employees/view/:id', validateToken, employeeController.show.bind(employeeController));
router.put('/employees/update/:id', validateToken, commonValidation(EmployeeUpdateDTO), employeeController.update.bind(employeeController));
router.delete('/employees/delete/:id', validateToken, employeeController.delete.bind(employeeController));

router.get('/office_hours', validateToken, officeHourController.index.bind(officeHourController));
router.get('/office_hours/view/:id', validateToken, officeHourController.show.bind(officeHourController));

router.get('/work_schedules', validateToken, workScheduleController.index.bind(workScheduleController));
router.post('/work_schedules', validateToken, commonValidation(WorkScheduleCreateDTO), workScheduleController.store.bind(workScheduleController));
router.get('/work_schedules/view/:id', validateToken, workScheduleController.show.bind(workScheduleController));
router.put('/work_schedules/update/:id', validateToken, commonValidation(WorkScheduleUpdateDTO), workScheduleController.update.bind(workScheduleController));
router.delete('/work_schedules/delete/:id', validateToken, workScheduleController.delete.bind(workScheduleController));

router.get('/managers', validateToken, departmentManagerController.index.bind(departmentManagerController));
router.post('/managers', validateToken, commonValidation(ManagerCreateDTO), departmentManagerController.store.bind(departmentManagerController));
router.get('/managers/view/:id', validateToken, departmentManagerController.show.bind(departmentManagerController));
router.put('/managers/update/:id', validateToken, commonValidation(ManagerUpdateDTO), departmentManagerController.update.bind(departmentManagerController));
router.delete('/managers/delete/:id', validateToken, departmentManagerController.delete.bind(departmentManagerController));

router.get('/holidays', validateToken, holidayController.index.bind(holidayController));
router.post('/holidays', validateToken, commonValidation(HolidayCreateDTO), holidayController.store.bind(holidayController));
router.get('/holidays/view/:id', validateToken, holidayController.show.bind(holidayController));
router.put('/holidays/update/:id', validateToken, commonValidation(HolidayUpdateDTO), holidayController.update.bind(holidayController));
router.delete('/holidays/delete/:id', validateToken, holidayController.delete.bind(holidayController));

export default router;