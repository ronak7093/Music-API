import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { AlbumsMeta } from "./AlbumsMeta";
import { User } from "./User";

@Entity()
export class Albums {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public albumsName: string;

  @Column({ default: false })
  public isDeleted: Boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @ManyToOne((type) => User, (user) => user.albums)
  user: User;

  @OneToMany((type) => AlbumsMeta, (albumsmeta) => albumsmeta.albums)
  albumsmeta: AlbumsMeta[];
}
