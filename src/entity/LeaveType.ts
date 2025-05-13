import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { LeaveBalance } from './LeaveBalance';
import { LeaveRequest } from './LeaveRequest';
import { User } from './User';

@Entity({ name: 'leave_types' })
export class LeaveType {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ default: false })
  is_paid!: boolean;

  @Column({ type: 'smallint' })
  max_days_per_year!: number;

  @Column({ type: 'smallint', default: 0 })
  carry_over_days!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @ManyToOne(() => User, user => user.created_leave_types, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  creator!: Partial<User>;

  @ManyToOne(() => User, user => user.updated_leave_types, { nullable: false })
  @JoinColumn({ name: 'updated_by' })
  updater!: Partial<User>;

  @Column()
  created_by!: number;

  @Column()
  updated_by!: number;

  @OneToMany(() => LeaveBalance, balance => balance.leave_type)
  balances!: LeaveBalance[];

  @OneToMany(() => LeaveRequest, request => request.leave_type)
  requests!: LeaveRequest[];
}