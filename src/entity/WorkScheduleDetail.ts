import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { WorkSchedule } from './WorkSchedule';
import { User } from './User';

@Entity({ name: 'work_schedule_details' })
export class WorkScheduleDetail {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => WorkSchedule, schedule => schedule.details)
  @JoinColumn({ name: 'work_schedule_id' })
  schedule!: WorkSchedule;

  @Column({ type: 'smallint' })
  day_number!: number; // 1-7 (Monday-Sunday)

  @Column({ type: 'time' })
  work_from!: string;

  @Column({ type: 'time' })
  work_to!: string;

  @Column({ default: false })
  is_off!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @ManyToOne(() => User, user => user.created_work_schedule_details, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by!: User;

  @ManyToOne(() => User, user => user.updated_work_schedule_details, { nullable: false })
  @JoinColumn({ name: 'updated_by' })
  updated_by!: User;
}