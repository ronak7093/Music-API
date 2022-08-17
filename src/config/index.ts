import * as dotenv from "dotenv";
import { number } from "joi";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

console.log("process.env.NODE_ENV", process.env.NODE_ENV);

const envFound = dotenv.config();
if (!envFound) {
  // Throw generic error
  throw new Error("Couldn't find .env file");
}

export default {
  /**
   *  Application port.
   */
  port: process.env.PORT,

  /**
   *  Application pagesize.
   */
  pagesize: process.env.PAGESIZE,

  /**
   * JWT Secret
   */
  jwtSecret: process.env.JWT_SECRET,

  /**
   * Postgresql connection options.
   */
  database: {
    type: process.env.TYPEORM_CONNECTION,
    /**
     * Connection url where perform connection to.
     */
    url: process.env.TYPEORM_HOST,
    /**
     * Database host.
     */
    host: process.env.TYPEORM_HOST,
    /**
     * Database host port.
     */
    // tslint:disable-next-line: radix
    //@ts-ignore
    port: Number.parseInt(process.env.TYPEORM_PORT),
    /**
     * Database username.
     */
    username: process.env.TYPEORM_USERNAME,
    /**
     * Database password.
     */
    password: process.env.TYPEORM_PASSWORD,
    /**
     * Database name to connect to.
     */
    database: process.env.TYPEORM_DATABASE,
  },
  mail: {
    from: process.env.MAIL_FROM,
    email: process.env.MAIL_ADDRESS,
    password: process.env.MAIL_PASSWORD,
    smtp: process.env.MAIL_SERVER,
    // @ts-ignore
    port: Number.parseInt(process.env.MAIL_PORT),
    secure: true,
  },

  webappUrl: process.env.WEBAPP_LINK,
  appName: process.env.APP_NAME,
  userTopic: process.env.USER_TOPIC,
  apiEndpoint: process.env.API_ENDPOINT,
};
