import Container from "typedi";
import { Connection, createConnection } from "typeorm";
import { useContainer } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import config from "../config";
import { Albums } from "../models/Albums";
import { AlbumsMeta } from "../models/AlbumsMeta";
import { Favorite } from "../models/Favorite";
import { User } from "../models/User";
import { UserMeta } from "../models/UserMeta";
import { UserSetting } from "../models/UserSetting";

export default async (): Promise<Connection> => {
  // console.log("config.database", config.database);
  const connectionOptions: PostgresConnectionOptions = {
    type: "postgres",
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.database,
    synchronize: true,
    logging: false,
    extra: {
      connectionLimit: 90,
    },
    entities: [User, UserMeta, UserSetting, Albums, AlbumsMeta, Favorite],
  };

  // typedi + typeorm
  useContainer(Container);

  // create a connection using modified connection options
  const connection = await createConnection(connectionOptions);

  return connection;
};
