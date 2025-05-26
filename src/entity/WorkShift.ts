import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, OneToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { WorkSchedule } from './WorkSchedule';
import { WorkShiftDetail } from './WorkShiftDetail';

@Entity({ name: 'work_shifts' })
export class WorkShift {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => WorkSchedule, schedule => schedule.workShifts)
  @JoinColumn({ name: 'work_schedule_id' })
  schedule!: Partial<WorkSchedule>;

  @Column()
  work_schedule_id: number;

  @OneToMany(() => WorkShiftDetail, details => details.workshift)
  @JoinColumn({ name: 'work_shift_id' })
  details!: Partial<WorkShiftDetail>[];

  @Column({ type: 'date' })
  start_from!: Date;

  @Column({ type: 'date', nullable: true })
  end_to?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @ManyToOne(() => User, user => user.created_work_shifts, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  creator!: Partial<User>;

  @ManyToOne(() => User, user => user.updated_work_shifts, { nullable: false })
  @JoinColumn({ name: 'updated_by' })
  updater!: Partial<User>;

  @Column()
  created_by!: number;

  @Column()
  updated_by!: number;
}
