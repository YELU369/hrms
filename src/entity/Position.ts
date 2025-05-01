import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Department } from './Department';
import { PositionSalary } from './PositionSalary';
import { User } from './User';
import { Employee } from './Employee';

@Entity({ name: 'positions' })
export class Position {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Department, department => department.positions)
  @JoinColumn({ name: 'department_id' })
  department!: Department;

  @Column()
  title!: string;

  @Column({ default: false })
  is_manager!: boolean;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @ManyToOne(() => User, user => user.created_positions, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by!: User;

  @ManyToOne(() => User, user => user.updated_positions, { nullable: false })
  @JoinColumn({ name: 'updated_by' })
  updated_by!: User;

  @OneToMany(() => PositionSalary, salary => salary.position)
  salaries!: PositionSalary[];

  @OneToMany(() => Employee, employee => employee.position)
  employees!: Employee[];
}