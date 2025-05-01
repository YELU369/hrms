import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Employee } from './Employee';

@Entity({ name: 'employee_salaries' })
export class EmployeeSalary {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Employee, employee => employee.salaries)
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  salary!: number;

  @Column({ type: 'date' })
  start_from!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @ManyToOne(() => User, user => user.created_user_salaries, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by!: User;

  @ManyToOne(() => User, user => user.updated_user_salaries, { nullable: false })
  @JoinColumn({ name: 'updated_by' })
  updated_by!: User;
}