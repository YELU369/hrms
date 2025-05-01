import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'blacklisted_tokens' })
export class BlacklistedToken {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  token!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;
}