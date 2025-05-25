import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './User';
import { WorkScheduleDetail } from './WorkScheduleDetail';
import { EmployeeWorkSchedule } from './EmployeeWorkSchedule';

@Entity({ name: 'work_schedules' })
export class WorkSchedule {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @OneToMany(() => WorkScheduleDetail, details => details.schedule)
  details!: WorkScheduleDetail[];
  
  @ManyToOne(() => User, user => user.created_work_schedules, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  creator!: Partial<User>;

  @ManyToOne(() => User, user => user.updated_work_schedules, { nullable: false })
  @JoinColumn({ name: 'updated_by' })
  updater!: Partial<User>;

  @Column()
  created_by!: number;

  @Column()
  updated_by!: number;
  
  @OneToMany(() => EmployeeWorkSchedule, scheduleBindings => scheduleBindings.schedule)
  @JoinColumn({ name: 'work_schedule_id' })
  scheduleBindings!: EmployeeWorkSchedule[];
}