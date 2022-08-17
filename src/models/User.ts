import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import { Albums } from "./Albums";
import { Favorite } from "./Favorite";
import { UserMeta } from "./UserMeta";
import { UserSetting } from "./UserSetting";

export class ISignUp {
  name: string;
  email: string;
  password: string;
  role: string;
}
export class ISignIn {
  email: string;
  password: string;
}
export enum SocialType {
  APPLE = "apple",
  GOOGLE = "google",
}

export class IChangePassword {
  old_password: string;
  new_password: string;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    nullable: true,
  })
  public name: string;

  @Column({
    unique: true,
    nullable: true,
  })
  public email: string;

  @Column({
    nullable: true,
  })
  public password: string;

  @Column({ nullable: true })
  public salt: string;

  @Column()
  public role: string;

  @Column({ nullable: true })
  public google_id: string;

  @Column({ nullable: true })
  public apple_id: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column({
    default: false,
  })
  public isVerified: Boolean;

  @OneToOne((type) => UserMeta, (usermeta) => usermeta.user, {
    eager: true,
  })
  public usermeta: UserMeta[];

  @OneToOne((type) => UserSetting, (usersetting) => usersetting.user, {
    eager: true,
  })
  public usersetting: UserSetting;

  @OneToMany((type) => Albums, (albums) => albums.user)
  albums: Albums[];

  @OneToMany((type) => Favorite, (favorite) => favorite.user)
  favorite: Favorite[];
}
