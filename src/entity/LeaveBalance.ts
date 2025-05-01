import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { LeaveType } from './LeaveType';
import { Employee } from './Employee';

@Entity({ name: 'leave_balances' })
export class LeaveBalance {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Employee, employee => employee.leave_balances)
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;

  @ManyToOne(() => LeaveType, leaveType => leaveType.balances)
  @JoinColumn({ name: 'leave_type_id' })
  leave_type!: LeaveType;

  @Column({ type: 'date' })
  start_from!: Date;

  @Column({ type: 'date' })
  end_to!: Date;

  @Column({ type: 'decimal', precision: 4, scale: 1 })
  total!: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, default: 0 })
  used!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;
}