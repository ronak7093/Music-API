import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

export enum Language {
  ENGLISH = "english",
  HINDI = "hindi",
  GUJARATI = "gujarati",
  INTERNATIONAL = "international",
  MARATHI = "marathi",
  PUNJABI = "punjabi",
  TAMIL = "tamil",
  TELUGU = "telugu",
  MALAYALAM = "malayalam",
  BENGALI = "bengali",
}
export enum cidr {
  AUTOMATIC = "automatic",
  LOW = "low",
  NORMAL = "normal",
  HIGH = "high",
  VERYHIGH = "veryhigh",
}

@Entity()
export class UserSetting {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "enum", enum: Language, default: Language.ENGLISH })
  public language: Language;

  @Column({ default: false })
  public audioQuality: Boolean;

  @Column({ default: false })
  public downloadAudioOnly: Boolean;

  @Column({ default: false })
  public streamAudio: Boolean;

  @Column({ type: "enum", enum: cidr, default: cidr.AUTOMATIC })
  public WiFistStreaming: cidr;

  @Column({ type: "enum", enum: cidr, default: cidr.AUTOMATIC })
  public cellularStreaming: cidr;

  @Column({ type: "enum", enum: cidr, default: cidr.AUTOMATIC })
  public download: cidr;

  @Column({ default: true })
  public notifications: boolean;

  @OneToOne((type) => User, (user) => user.usersetting)
  @JoinColumn()
  user: User;
}
