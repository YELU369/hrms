import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Employee } from './Employee';

@Entity({ name: 'employee_addresses' })
export class EmployeeAddress {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Employee, employee => employee.addresses)
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;

  @Column()
  country_id!: number;

  @Column()
  state_id!: number;

  @Column()
  city_id!: number;

  @Column()
  street_address!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @ManyToOne(() => User, user => user.created_user_addresses, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by!: User;

  @ManyToOne(() => User, user => user.updated_user_addresses, { nullable: false })
  @JoinColumn({ name: 'updated_by' })
  updated_by!: User;
}