import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Employee } from './Employee';
import { CheckOutRecord } from './CheckOutRecord';

@Entity({ name: 'check_in_records' })
export class CheckInRecord {

  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Employee, employee => employee.check_in_records)
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;

  @Column({ type: 'timestamp' })
  check_in!: Date;

  @Column({ type: 'int', default: 0 })
  late_in_minutes!: number;

  @Column({ type: 'int', default: 0 })
  early_in_minutes!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @OneToOne(() => CheckOutRecord, checkOut => checkOut.check_in)
  check_out_record!: CheckOutRecord;
  
}