import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Position } from './Position';
import { User } from './User';

@Entity({ name: 'position_salaries' })
@Unique(['min_salary', 'start_from', 'position'])
@Unique(['max_salary', 'start_from', 'position'])
export class PositionSalary {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Position, position => position.salaries)
  @JoinColumn({ name: 'position_id' })
  position!: Position;

  @Column()
  position_id!: number;

  @Column({ type: 'integer' })
  min_salary!: number;

  @Column({ type: 'integer' })
  max_salary!: number;

  @Column({ type: 'date' })
  start_from!: Date;

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
