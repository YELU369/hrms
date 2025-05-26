import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, OneToOne } from 'typeorm';
import { User } from './User';
import { Employee } from './Employee';
import { WorkShift } from './WorkShift';

@Entity({ name: 'work_shift_details' })
export class WorkShiftDetail {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Employee, employee => employee.workShiftDetail)
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;

  @Column({ unique: true})
  employee_id: number;

  @ManyToOne(() => WorkShift, workshift => workshift.details)
  @JoinColumn({ name: 'work_shift_id' })
  workshift!: WorkShift;

  @Column()
  work_shift_id: number;

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
