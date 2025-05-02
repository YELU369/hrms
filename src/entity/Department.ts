import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Position } from './Position';
import { DepartmentManager } from './DepartmentManager';
import { User } from './User';

@Entity({ name: 'departments' })
export class Department {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({unique: true})
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @ManyToOne(() => User, user => user.created_departments, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by!: User;

  @ManyToOne(() => User, user => user.updated_departments, { nullable: false })
  @JoinColumn({ name: 'updated_by' })
  updated_by!: User;

  @OneToMany(() => Position, position => position.department)
  positions!: Position[];

  @OneToMany(() => DepartmentManager, manager => manager.department)
  managers!: DepartmentManager[];
}