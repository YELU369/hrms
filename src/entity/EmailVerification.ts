import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToOne } from "typeorm"
import { User } from "./User";

@Entity({ name: 'email_verifications' })
export class EmailVerification {
  
  @PrimaryGeneratedColumn()
  id!: number

  @Column({type: "varchar"})
  email!: string

  @Column({length: 255})
  token!: string

  @Column({type: "timestamp"})
  expired_at!: Date

  @Column({type: "boolean", default: false})
  is_verified!: boolean

  @Column("datetime", { default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column("datetime", { default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at!: Date;
}
