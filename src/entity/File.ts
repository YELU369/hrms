import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({ name: 'files' })
export class File {
  
  @PrimaryGeneratedColumn()
  id!: number

  @Column({length: 100})
  path!: string

  @Column({length: 100})
  name!: string

  @Column({
    type: "enum",
    enum: ["image", "video", "doc"],
    default: "doc"
  })
  type!: "image" | "video" | "doc";

  @Column("datetime", { default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column("datetime", { default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at!: Date;
}
