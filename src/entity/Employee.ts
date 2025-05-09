import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { Department } from './Department';
import { Position } from './Position';
import { EmployeeAddress } from './EmployeeAddress';
import { DepartmentManager } from './DepartmentManager';
import { WorkSchedule } from './WorkSchedule';
import { CheckInRecord } from './CheckInRecord';
import { LeaveBalance } from './LeaveBalance';
import { LeaveRequest } from './LeaveRequest';
import { OvertimeRequest } from './OvertimeRequest';
import { Payroll } from './Payroll';
import { EmployeeEmergencyContact } from './EmployeeEmergencyContact';
import { EmployeeSalary } from './EmployeeSalary';
import { User } from './User';
import { EmployeeUser } from './EmployeeUser';
import { EmployeeWorkSchedule } from './EmployeeWorkSchedule';

@Entity({ name: 'employees' })
export class Employee {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  first_name!: string;

  @Column()
  last_name!: string;

  @Column()
  code!: string;

  @Column({ unique: true })
  nrc!: string;

  @ManyToOne(() => Position, position => position.employees, { nullable: false })
  @JoinColumn({ name: 'position_id' })
  position: Position;

  @Column()
  position_id: number;

  @Column()
  phone!: string;

  @Column()
  email!: string;

  @Column({ type: 'date' })
  joined_date!: Date;

  @Column({
    type: 'enum',
    enum: ['Full-time', 'Part-time', 'Contract'],
    default: 'Full-time'
  })
  employment_type!: 'Full-time' | 'Part-time' | 'Contract';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @ManyToOne(() => User, user => user.created_leave_types, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by!: User;

  @ManyToOne(() => User, user => user.updated_leave_types, { nullable: false })
  @JoinColumn({ name: 'updated_by' })
  updated_by!: User;

  @OneToMany(() => EmployeeSalary, salary => salary.employee)
  salaries!: EmployeeSalary[];

  @OneToMany(() => EmployeeAddress, address => address.employee)
  addresses!: EmployeeAddress[];

  @OneToMany(() => EmployeeEmergencyContact, contact => contact.employee)
  emergency_contacts!: EmployeeEmergencyContact[];

  @OneToMany(() => DepartmentManager, manager => manager.employee)
  managed_departments!: DepartmentManager[];

  @OneToMany(() => CheckInRecord, checkIn => checkIn.employee)
  check_in_records!: CheckInRecord[];

  @OneToMany(() => LeaveBalance, balance => balance.employee)
  leave_balances!: LeaveBalance[];

  @OneToMany(() => LeaveRequest, request => request.employee)
  leave_requests!: LeaveRequest[];

  @OneToMany(() => OvertimeRequest, request => request.employee)
  overtime_requests!: OvertimeRequest[];

  @OneToMany(() => Payroll, payroll => payroll.employee)
  payrolls!: Payroll[];

  @OneToOne(() => EmployeeUser, userBinding => userBinding.employee)
  userBinding!: EmployeeUser[];

  @OneToOne(() => EmployeeWorkSchedule, scheduleBinding => scheduleBinding.employee)
  @JoinColumn({ name: 'employee_id' })
  scheduleBinding!: EmployeeWorkSchedule[];
}