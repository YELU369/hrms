import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { Department } from './Department';
import { Position } from './Position';
import { EmployeeAddress } from './EmployeeAddress';
import { DepartmentManager } from './DepartmentManager';
import { WorkSchedule } from './WorkSchedule';
import { LeaveRequest } from './LeaveRequest';
import { OvertimeRequest } from './OvertimeRequest';
import { LeaveType } from './LeaveType';
import { PositionSalary } from './PositionSalary';
import { WorkScheduleDetail } from './WorkScheduleDetail';
import { EmployeeEmergencyContact } from './EmployeeEmergencyContact';
import { EmployeeSalary } from './EmployeeSalary';
import { Employee } from './Employee';
import { EmployeeUser } from './EmployeeUser';
import { OfficeHour } from './OfficeHour';
import { Holiday } from './Holiday';
import { WorkShift } from './WorkShift';

@Entity({ name: 'users' })
export class User {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  password!: string;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ type: "timestamp", nullable: true})
  verified_at: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @OneToOne(() => EmployeeUser, employeeBinding => employeeBinding.employee)
  employeeBinding!: EmployeeUser[];

  created_employees: Employee[];
  updated_employees: Employee[];

  created_departments: Department[];
  updated_departments: Department[];

  created_department_managers: DepartmentManager[];
  updated_department_managers: DepartmentManager[];

  approved_leave_requests: LeaveRequest[];

  created_leave_types: LeaveType[];
  updated_leave_types: LeaveType[];

  approved_overtime_requests: OvertimeRequest[];

  created_positions: Position[];
  updated_positions: Position[];

  created_position_salaries: PositionSalary[];
  updated_position_salaries: PositionSalary[];

  created_user_addresses: EmployeeAddress[];
  updated_user_addresses: EmployeeAddress[];

  created_user_salaries: EmployeeSalary[];
  updated_user_salaries: EmployeeSalary[];

  created_emergency_contacts: EmployeeEmergencyContact[];
  updated_emergency_contacts: EmployeeEmergencyContact[];

  created_work_schedules: WorkSchedule[];
  updated_work_schedules: WorkSchedule[];

  created_work_schedule_details: WorkScheduleDetail[];
  updated_work_schedule_details: WorkScheduleDetail[];

  created_employee_user_bindings: EmployeeUser[];
  updated_employee_user_bindings: EmployeeUser[];

  created_office_hours: OfficeHour[];
  updated_office_hours: OfficeHour[];

  created_holidays: Holiday[];
  updated_holidays: Holiday[];

  created_work_shifts: WorkShift[];
  updated_work_shifts: WorkShift[];
}