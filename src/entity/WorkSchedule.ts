import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, Unique } from 'typeorm';
import { User } from './User';
import { WorkScheduleDetail } from './WorkScheduleDetail';
import { Employee } from './Employee';
import { EmployeeWorkSchedule } from './EmployeeWorkSchedule';

@Entity({ name: 'work_schedules' })
@Unique(['start_from', 'employee'])
export class WorkSchedule {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'date' })
  start_from!: Date;

  @Column({ type: 'date', nullable: true })
  end_to?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @OneToMany(() => WorkScheduleDetail, detail => detail.schedule)
  details!: WorkScheduleDetail[];
  
  @ManyToOne(() => User, user => user.created_work_schedules, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by!: User;

  @ManyToOne(() => User, user => user.updated_work_schedules, { nullable: false })
  @JoinColumn({ name: 'updated_by' })
  updated_by!: User;
  
  @OneToMany(() => EmployeeWorkSchedule, scheduleBindings => scheduleBindings.schedule)
  @JoinColumn({ name: 'work_schedule_id' })
  scheduleBindings!: EmployeeWorkSchedule[];
}