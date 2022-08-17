import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class UserMeta {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    nullable: true,
  })
  originalname: string;

  @Column({
    nullable: true,
  })
  mimetype: string;

  @Column({
    nullable: true,
  })
  size: number;

  @Column({
    nullable: true,
  })
  location: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @OneToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User;
}
