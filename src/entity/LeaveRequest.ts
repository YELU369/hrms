import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { LeaveType } from './LeaveType';
import { Employee } from './Employee';

@Entity({ name: 'leave_requests' })
export class LeaveRequest {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Employee, employee => employee.leave_requests)
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;

  @ManyToOne(() => LeaveType, leaveType => leaveType.requests)
  @JoinColumn({ name: 'leave_type_id' })
  leave_type!: LeaveType;

  @Column({ type: 'date' })
  start_from!: Date;

  @Column({ type: 'date' })
  end_to!: Date;

  @Column({ type: 'decimal', precision: 4, scale: 1 })
  total_days!: number;

  @Column({ type: 'text' })
  reason!: string;

  @Column({
    type: 'enum',
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  })
  status!: 'Pending' | 'Approved' | 'Rejected';

  @ManyToOne(() => User, user => user.approved_leave_requests, { nullable: false })
  @JoinColumn({ name: 'approved_by' })
  approved_by!: User;

  @Column({ type: 'timestamp', nullable: true })
  approved_at?: Date;

  @Column({ type: 'text', nullable: true })
  remark?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;
}