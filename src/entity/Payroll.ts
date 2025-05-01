import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Employee } from './Employee';

@Entity({ name: 'payrolls' })
export class Payroll {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Employee, employee => employee.payrolls)
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;

  @Column({ type: 'date' })
  start_from!: Date;

  @Column({ type: 'date' })
  end_to!: Date;

  @Column({ type: 'int', default: 0 })
  total_late_minutes!: number;

  @Column({ type: 'int', default: 0 })
  total_early_out_minutes!: number;

  @Column({ type: 'int', default: 0 })
  total_overtime_minutes!: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, default: 0 })
  total_leave_days!: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, default: 0 })
  total_unpaid_leave_days!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  tax_deduction!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  resulting_salary!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;
}