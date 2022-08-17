import { celebrate, Joi } from "celebrate";
import { NextFunction, Request, Response, Router } from "express";
import { Container } from "typedi";
import {
  ISignUp,
  ISignIn,
  SocialType,
  IChangePassword,
} from "../../../models/User";
import { CONSTANT } from "../../../constant";
import UserServices from "../../services/user";
import { User } from "../../../models/User";
import middlewares from "../../middleware";

const route = Router();

export default (app: Router) => {
  app.use("/user", route);

  route.post(
    "/signup",
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().trim().email().required(),
        password: Joi.string().required(),
        role: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        let payload = req.body as ISignUp;
        const userServiceInstance = Container.get(UserServices);
        const { user, token } = await userServiceInstance.SignUp(payload);
        return res
          .json({ user, token, message: CONSTANT.LINK_SENT })
          .status(201);
      } catch (error) {
        console.log(error);
        return next(error);
      }
    }
  );
  route.post(
    "/signin",
    celebrate({
      body: Joi.object({
        email: Joi.string().trim().email().required(),
        password: Joi.string().min(8).max(30).required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        let payload = req.body as ISignIn;

        const userServiceInstance = Container.get(UserServices);
        const { user, token } = await userServiceInstance.SignIn(payload);
        return res.json({ user, token }).status(200);
      } catch (e) {
        console.log(" error ", e);
        return next(e);
      }
    }
  );

  route.post(
    "/forgot-password",
    celebrate({
      body: Joi.object({
        email: Joi.string().trim().email().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email } = req.body;
        const userServiceInstance = Container.get(UserServices);
        await userServiceInstance.ForgotPassword(email);
        return res
          .json({ message: CONSTANT.FORGOT_PASSWORD_EMAIL_SENT })
          .status(200);
      } catch (e) {
        console.log(" error ", e);
        return next(e);
      }
    }
  );

  route.post(
    "/reset-password",
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    celebrate({
      body: Joi.object({
        new_password: Joi.string().min(8).max(30).required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userObj = req.currentUser;
        const { new_password } = req.body;
        const authServiceInstance = Container.get(UserServices);

        await authServiceInstance.ResetPassword(userObj, new_password);
        return res
          .json({ message: CONSTANT.SUCCESS_RESET_PASSWORD })
          .status(200);
      } catch (e) {
        console.log(" error ", e);
        return next(e);
      }
    }
  );
  route.post(
    "/change-password",
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    celebrate({
      body: Joi.object({
        old_password: Joi.string().min(8).max(30).required(),
        new_password: Joi.string().min(8).max(30).required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userObj = req.currentUser;
        const payload = req.body as IChangePassword;
        const authServiceInstance = Container.get(UserServices);

        await authServiceInstance.ChangePassword(userObj, payload);
        return res.json({ message: CONSTANT.PASSWORD_RESET }).status(200);
      } catch (e) {
        console.log(" error ", e);
        return next(e);
      }
    }
  );
};
