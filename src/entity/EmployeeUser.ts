import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, OneToOne } from 'typeorm';
import { Position } from './Position';
import { User } from './User';
import { Employee } from './Employee';

@Entity({ name: 'employee_users' })
@Unique(['employee_id', 'user_id'])
export class EmployeeUser {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Employee, employee => employee.userBinding)
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;

  @Column()
  employee_id: number;

  @OneToOne(() => User, user => user.employeeBinding)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column()
  user_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @ManyToOne(() => User, user => user.created_position_salaries, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by!: User;

  @ManyToOne(() => User, user => user.updated_position_salaries, { nullable: false })
  @JoinColumn({ name: 'updated_by' })
  updated_by!: User;
}
