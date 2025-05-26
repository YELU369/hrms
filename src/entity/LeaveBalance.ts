import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { LeaveType } from './LeaveType';
import { Employee } from './Employee';
import { User } from './User';

@Entity({ name: 'leave_balances' })
export class LeaveBalance {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Employee, employee => employee.leave_balances)
  @JoinColumn({ name: 'employee_id' })
  employee!: Partial<Employee>;

  @ManyToOne(() => LeaveType, leaveType => leaveType.balances)
  @JoinColumn({ name: 'leave_type_id' })
  leaveType!: Partial<LeaveType>;

  @Column({ type: 'int' })
  employee_id!: number;

  @Column({ type: 'int' })
  leave_type_id!: number;

  @Column({ type: 'date' })
  start_from!: Date;

  @Column({ type: 'date' })
  end_to!: Date;

  @Column({ type: 'decimal', precision: 4, scale: 1 })
  total_days!: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, default: 0 })
  used_days!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @ManyToOne(() => User, user => user.created_leave_balances, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  creator!: Partial<User>;

  @ManyToOne(() => User, user => user.updated_leave_balances, { nullable: false })
  @JoinColumn({ name: 'updated_by' })
  updater!: Partial<User>;

  @Column()
  created_by!: number;

  @Column()
  updated_by!: number;
}