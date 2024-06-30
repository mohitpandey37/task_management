import _RS from "../helpers/ResponseHelper";
import Auth from "../helpers/Auth";
import * as mongoose from "mongoose";
import User from "../models/User";
const startTime = new Date().getTime();
// import Admin from "../models/adminModel"
class Authentication {
  constructor() { }

  static async user(req, res, next) {
    const startTime = new Date().getTime();
    try {
      let token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
        return _RS.badRequest(res, "UNAUTHORIZE", "UNAUTHORIZE", {}, startTime);
      }
      const decoded: any = await Auth.decodeJwt(token);

      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return _RS.badRequest(res, "UNAUTHORIZE", "UNAUTHORIZE", {}, startTime);
      }

      if (!currentUser.is_active) {
        currentUser.deviceToken = "";
        await currentUser.save();
        return _RS.badRequest(res, "FORBIDDEN", "Account Deactivated Please contact to admin", {}, startTime);
      }
      if (currentUser.isDeleted) {
        return _RS.badRequest(res, "FORBIDDEN", "Account Delete Please Use another email", {}, startTime);
      }
      await currentUser.save();
      req.user = currentUser;      
      next();
    } catch (err) {
      if (err.message == "jwt expired") {
        res.status(403).json({
          status: 403,
          statusText: "JWT_EXPIRED",
          message: "message" ? "JWT_EXPIRED" : "Un-authenticated Request!",
        });
      }
    }
  }

  static async admin(req, res, next) {
    try {
      let token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }
      if (!token) {
        return _RS.badRequest(res, "UNAUTHORIZE", "UNAUTHORIZE", {}, startTime);
      }

      const decoded: any = await Auth.decodeJwt(token);

      const currentUser = await User.findOne({_id: decoded.id,  role: { $in: ['admin', 'manager']  }});

      if (!currentUser) {
        return _RS.badRequest(res, "UNAUTHORIZE", "UNAUTHORIZE", {}, startTime);
      }

      req.user = currentUser;
      next();
    } catch (err) {
      if (err.message == "jwt expired") {
        res.status(403).json({
          status: 403,
          statusText: "JWT_EXPIRED",
          message: "message" ? "JWT_EXPIRED" : "Un-authenticated Request!",
        });
      }
    }
  }

}

export default Authentication;
