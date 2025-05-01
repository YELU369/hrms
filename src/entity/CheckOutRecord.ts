import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { CheckInRecord } from './CheckInRecord';

@Entity({ name: 'check_out_records' })
export class CheckOutRecord {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => CheckInRecord)
  @JoinColumn({ name: 'check_in_id' })
  check_in!: CheckInRecord;

  @Column({ type: 'timestamp' })
  check_out!: Date;

  @Column({ type: 'int', default: 0 })
  late_out_minutes!: number;

  @Column({ type: 'int', default: 0 })
  early_out_minutes!: number;

  @Column({ type: 'int', default: 0 })
  working_minutes!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;
}