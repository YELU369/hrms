import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Department } from './Department';
import { User } from './User';
import { Employee } from './Employee';

@Entity({ name: 'department_managers' })
export class DepartmentManager {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Employee, employee => employee.managed_departments)
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;

  @ManyToOne(() => Department, department => department.managers)
  @JoinColumn({ name: 'department_id' })
  department!: Department;

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