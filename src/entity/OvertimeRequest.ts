import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Employee } from './Employee';

@Entity({ name: 'overtime_requests' })
export class OvertimeRequest {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Employee, employee => employee.overtime_requests)
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;

  @Column({ type: 'timestamp' })
  start_from!: Date;

  @Column({ type: 'timestamp' })
  end_to!: Date;

  @Column({ type: 'int' })
  total_minutes!: number;

  @Column({ type: 'text' })
  reason!: string;

  @Column({
    type: 'enum',
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  })
  status!: 'Pending' | 'Approved' | 'Rejected';

  @ManyToOne(() => User, user => user.approved_overtime_requests, { nullable: true })
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