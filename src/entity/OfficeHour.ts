import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany, Unique } from "typeorm"
import { User } from "./User";
import { WorkScheduleDetail } from "./WorkScheduleDetail";

@Entity({ name: 'office_hours' })
@Unique(['work_from', 'work_to'])
export class OfficeHour {
  
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  work_from!: string

  @Column()
  work_to!: string

  @Column("datetime", { default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column("datetime", { default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at!: Date;

  @ManyToOne(() => User, user => user.created_office_hours)
  @JoinColumn({ name: 'created_by' })
  creator!: Partial<User>;

  @ManyToOne(() => User, user => user.updated_office_hours)
  @JoinColumn({ name: 'updated_by' })
  updater!: Partial<User>;

  @Column()
  created_by!: number;

  @Column()
  updated_by!: number;

  @OneToMany(() => WorkScheduleDetail, scheduleDetails => scheduleDetails.officeHour)
  @JoinColumn({ name: 'office_hour_id' })
  scheduleDetails: OfficeHour;
}
