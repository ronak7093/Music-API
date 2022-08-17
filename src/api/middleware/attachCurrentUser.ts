import { Container } from "typedi";
import AuthService from "../services/auth";
/**
 * Attach user to req.user
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const attachCurrentUser = async (req, res, next) => {
  try {
    const authServiceInstance = Container.get(AuthService);
    const userRecord = await authServiceInstance.findOne(req.token.id);
    if (!userRecord) {
      return res.status(401).json({
        error: {
          message: "Unauthorized",
        },
      });
    }
    const currentUser = userRecord;
    Reflect.deleteProperty(currentUser, "password");
    Reflect.deleteProperty(currentUser, "salt");
    req.currentUser = currentUser;
    req.currentUser.os = req.token.os;
    return next();
  } catch (e) {
    console.log(" Error attaching user to req");
    console.log(e);
    return next(e);
  }
};
export default attachCurrentUser;
