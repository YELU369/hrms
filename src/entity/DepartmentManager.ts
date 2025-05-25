import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Department } from './Department';
import { User } from './User';
import { Employee } from './Employee';

@Entity({ name: 'department_managers' })
@Unique(['date_from', 'employee_id', 'department_id'])
export class DepartmentManager {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Employee, employee => employee.managed_departments)
  @JoinColumn({ name: 'employee_id' })
  employee!: Partial<Employee>;

  @Column({ type: 'int' })
  employee_id!: number;

  @ManyToOne(() => Department, department => department.managers)
  @JoinColumn({ name: 'department_id' })
  department!: Partial<Department>;

  @Column({ type: 'int' })
  department_id!: number;

  @Column({ type: 'date' })
  date_from!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @ManyToOne(() => User, user => user.created_department_managers, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  creator!: Partial<User>;

  @ManyToOne(() => User, user => user.updated_department_managers, { nullable: false })
  @JoinColumn({ name: 'updated_by' })
  updater!: Partial<User>;

  @Column()
  created_by!: number;

  @Column()
  updated_by!: number;
}