import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, OneToOne } from 'typeorm';
import { Position } from './Position';
import { User } from './User';
import { Employee } from './Employee';
import { WorkSchedule } from './WorkSchedule';

@Entity({ name: 'employee_work_schedules' })
export class EmployeeWorkSchedule {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Employee, employee => employee.scheduleBinding)
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;

  @Column({ unique: true})
  employee_id: number;

  @OneToOne(() => WorkSchedule, schedule => schedule.scheduleBindings)
  @JoinColumn({ name: 'work_schedule_id' })
  schedule!: WorkSchedule;

  @Column()
  work_schedule_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @ManyToOne(() => User, user => user.created_position_salaries, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  creator!: Partial<User>;

  @ManyToOne(() => User, user => user.updated_position_salaries, { nullable: false })
  @JoinColumn({ name: 'updated_by' })
  updater!: Partial<User>;

  @Column()
  created_by!: number;

  @Column()
  updated_by!: number;
}
