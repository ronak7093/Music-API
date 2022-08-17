import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { FindOneOptions, Repository } from "typeorm";
import * as jwt from "jsonwebtoken";
import config from "../../config";
import { User } from "../../models/User";

@Service()
export default class AuthService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>
  ) {}

  public async findOne(
    id?: string,
    options?: FindOneOptions<User>
  ): Promise<User | undefined> {
    return await this.repository.findOne(id, options);
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
}
