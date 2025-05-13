import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { WorkSchedule } from './WorkSchedule';
import { User } from './User';
import { OfficeHour } from './OfficeHour';
import { nullable } from 'zod';

@Entity({ name: 'work_schedule_details' })
@Unique(['day_number', 'work_schedule_id'])
export class WorkScheduleDetail {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => WorkSchedule, schedule => schedule.details)
  @JoinColumn({ name: 'work_schedule_id' })
  schedule: WorkSchedule;

  @Column()
  work_schedule_id: number;

  @Column({ type: 'smallint' })
  day_number!: number; // 1-7 (Monday-Sunday)

  @Column({ default: false })
  is_off!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @ManyToOne(() => User, user => user.created_work_schedule_details)
  @JoinColumn({ name: 'created_by' })
  creator!: Partial<User>;

  @ManyToOne(() => User, user => user.updated_work_schedule_details)
  @JoinColumn({ name: 'updated_by' })
  updater!: Partial<User>;

  @Column()
  created_by!: number;

  @Column()
  updated_by!: number;

  @ManyToOne(() => OfficeHour, officeHour => officeHour.scheduleDetails, { nullable: true })
  @JoinColumn({ name: 'office_hour_id' })
  officeHour?: OfficeHour;
}