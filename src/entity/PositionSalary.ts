import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Position } from './Position';
import { User } from './User';

@Entity({ name: 'position_salaries' })
export class PositionSalary {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Position, position => position.salaries)
  @JoinColumn({ name: 'position_id' })
  position!: Position;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  min_salary!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  max_salary!: number;

  @Column({ type: 'date' })
  start_from!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @ManyToOne(() => User, user => user.created_position_salaries, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by!: User;

  @ManyToOne(() => User, user => user.updated_position_salaries, { nullable: false })
  @JoinColumn({ name: 'updated_by' })
  updated_by!: User;
}