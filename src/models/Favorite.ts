import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public songName: string;

  @Column()
  public artists: string;

  @Column({
    nullable: true,
  })
  mimetype: string;

  @Column({
    nullable: true,
  })
  size: number;

  @Column({ default: false })
  public isDeleted: Boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @ManyToOne((type) => User, (user) => user.favorite)
  user: User;
}
