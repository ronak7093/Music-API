import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { Albums } from "./Albums";

@Entity()
export class AlbumsMeta {
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

  @Column({ default: false })
  public isFavorite: Boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @ManyToOne((type) => Albums, (albums) => albums.albumsmeta)
  albums: Albums;
}
