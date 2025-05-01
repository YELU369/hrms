import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Employee } from './Employee';

@Entity({ name: 'employee_emergency_contacts' })
export class EmployeeEmergencyContact {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Employee, employee => employee.emergency_contacts)
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;

  @Column()
  phone!: string;

  @Column()
  email!: string;

  @Column()
  name!: string;

  @Column()
  relation!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @ManyToOne(() => User, user => user.created_emergency_contacts, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by!: User;

  @ManyToOne(() => User, user => user.updated_emergency_contacts, { nullable: false })
  @JoinColumn({ name: 'updated_by' })
  updated_by!: User;
}