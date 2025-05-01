import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './User';
import { WorkScheduleDetail } from './WorkScheduleDetail';
import { Employee } from './Employee';

@Entity({ name: 'work_schedules' })
export class WorkSchedule {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Employee, employee => employee.work_schedules)
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;

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
}