import * as argon2 from "argon2";
import { randomBytes } from "crypto";
import { CONSTANT } from "../../constant";
import * as jwt from "jsonwebtoken";
import config from "../../config";
import { Exception } from "../../exception";
import { Container, Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../../models/User";
import * as bcrypt from "bcrypt";
import { FindOneOptions } from "typeorm";
import user from "../routes/user";
import {
  ISignUp,
  ISignIn,
  SocialType,
  IChangePassword,
} from "../../models/User";
import { errors } from "celebrate";
import { templates, MailServices } from "./mail";

@Service()
export default class UserServices {

  mailerServiceInstance = Container.get(MailServices);

  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>
  ) { }

  public async findOne(
    id?: string | number,
    options?: FindOneOptions<User>
  ): Promise<User | undefined> {
    return await this.repository.findOne(id, options);
  }

  public async saveUser(user: User): Promise<User> {
    return await this.repository.save(user);
  }

  public async SignUp(
    inputUser: ISignUp
  ): Promise<{ user: User; token: string }> {
    try {
      let exist = await this.repository.findOne({
        where: {
          email: inputUser.email,
        },
      });
      if (exist) {
        throw new Exception(CONSTANT.EMAIL_ALREADY_IN_USE, 400);
      }
      // let newUser = new User();
      // newUser.name = inputUser.name;
      // newUser.email = inputUser.email;
      // var salt = bcrypt.genSaltSync(10);
      // var password = bcrypt.hashSync(inputUser.password, salt);
      // newUser.password = password;
      // newUser.role = inputUser.role;
      // user = await this.saveUser(newUser);

      const salt = randomBytes(32);

      /**
       * Hash password first
       */
      const hashedPassword = await argon2.hash(inputUser.password, { salt });
      const userRecord = await this.repository.save({
        name: inputUser.name,
        email: inputUser.email.toLowerCase(),
        salt: salt.toString("hex"),
        password: hashedPassword,
        role: inputUser.role,
      });
      const user = userRecord;
      const token = this.generateToken(user);

      return { user, token };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  public generateToken(user: User): string {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        id: user.id, // We are gonna use this in the middleware 'isAuth'
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret
    );
  }

  public async SignIn(
    payload: ISignIn
  ): Promise<{ user: User; token: string }> {
    try {
      const user = await this.repository.findOne({
        email: payload.email,
      });
      if (user) {
        let result = await argon2.verify(user.password, payload.password);
        if (!result) {
          throw new Error(CONSTANT.INVALID_PASSWORD);
        }
      } else {
        throw new Error(CONSTANT.USER_NOT_FOUND);
      }
      const token = await this.generateToken(user);
      return { user, token };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async ForgotPassword(email: string) {
    try {
      const user = await this.repository.findOne({
        email,
      });
      if (!user) {
        throw new Exception(CONSTANT.EMAIL_NOT_EXIST, 404);
      }
      const token = this.generateToken(user);
      let template = templates.forgotPassword({
        username: user.name,
        forgot_password_link: `${config.webappUrl}reset-password/${token}`,
        AppName: config.appName,
      });
      this.mailerServiceInstance.send(email, `Reset Your Password ${config.appName}`, template);
      return;

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async ResetPassword(user: User, new_password: string) {
    const salt = randomBytes(32);
    /**
     * Hash password first
     */
    const hashedPassword = await argon2.hash(new_password, { salt });
    user.password = hashedPassword;
    user.salt = salt.toString("hex");
    return this.repository.save(user);
  }

  public async ChangePassword(user: User, reqData: IChangePassword) {
    try {
      let record = await this.repository.findOne(user.id);
      if (record) {
        user = record;
      }
      /**
       * We use verify from argon2 to prevent 'timing based' attacks
       */
      const validPassword = await argon2.verify(
        user.password,
        reqData.old_password
      );
      if (!validPassword) {
        throw new Error(CONSTANT.INVAID_PASSWORD);
      }

      const salt = randomBytes(32);
      /**
       * Hash password first
       */
      const hashedPassword = await argon2.hash(reqData.new_password, { salt });
      user.password = hashedPassword;
      user.salt = salt.toString("hex");
      user = await this.repository.save(user);

      Reflect.deleteProperty(user, "password");
      Reflect.deleteProperty(user, "salt");
      /**
       * Return user and token
       */
      return;
    } catch (error) {
      console.log(error);
      throw Error;
    }
  }
}
