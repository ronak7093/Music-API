import config from "../../config";
import nodemailer from "nodemailer";
import { Service } from "typedi";
import Handlebars, { compile } from "handlebars";
import fs from "fs";
import { Utf8 } from "crypto-ts/src/enc/Utf8";

export const mailer = nodemailer.createTransport({
  Service: "yandex",
  auth: {
    user: config.mail.email,
    pass: config.mail.password,
  },
});
const template = (file) => {
  return compile(fs.readFileSync(file, "utf8"));
};

export const templates = {
  forgotPassword: template("src/resources/forgot-password.html"),
};

@Service()
export class MailServices {
  async send(to: string, subject: string, template: string) {
    return mailer
      .sendMailer({
        from: `spotify<${config.mail.from}>`,
        to: to,
        subject: subject,
        html: template,
      })
      .then((data) => {
        console.log("mail sent", data);
        return data;
      })
      .catch((e) => {
        console.log("error sending mail", e);
        return e;
      });
  }
}
