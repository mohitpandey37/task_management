import _RS from "../../helpers/ResponseHelper";
import Auth from "../../helpers/Auth";
import { env } from "../../environments/Env";
import User from "../../models/User";
const express = require("express");
const cookieParser = require("cookie-parser");
const startTime = new Date().getTime();
const app = express();

app.use(cookieParser());
export class UserAuthController {
  /**
   * @api {post} /api/user/register Register User
   *  @apiBody {String} name       Name of the User.
   * @apiBody {String} email         Email.
   * @apiBody {String} password      Password.
   * @apiBody {String} role         role.
   * @apiName Register User
   * @apiGroup User
   * @apiVersion 1.0.0
   */
  static async register(req, res, next) {
    try {
      let { name, email, password, role } = req.body;
      let isUserExist = await User.findOne({ email: email });
      if (isUserExist)
        return _RS.badRequest(
          res,
          "CONFLICT",
          "user already exists",
          {},
          startTime
        );

      let docs = {
        name: name.replace(/\s+/g, " ").trim(),
        email: email.toLowerCase().replace(/\s+/g, " ").trim(),
        password: await Auth.encryptPassword(password),
        role,
      };

      let result = await new User(docs).save();

      return _RS.created(res, "SUCCESS", "Registered Successfully", result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @api {post} /api/user/login Login User
   * @apiBody {String} email         Email.
   * @apiBody {String} password      Password.
   * @apiName Login User
   * @apiGroup User
   * @apiVersion 1.0.0
   */
  static async login(req, res, next) {
    const { email, password } = req.body;
    try {
      let isUserExist = await User.findOne({
        email: email,
      });

      if (!isUserExist) {
        return _RS.badRequest(
          res,
          "NOTFOUND",
          "User not exist ,Please check the credentials",
          isUserExist,
          startTime
        );
      }
      const isPasswordValid = await Auth.comparePassword(
        password,
        isUserExist.password
      );

      if (!isPasswordValid) {
        return _RS.badRequest(
          res,
          "BADREQUEST",
          "Invalid password",
          {},
          startTime
        );
      }

      const payload = {
        id: isUserExist._id,
      };
      delete isUserExist["_doc"].password;

      const token = "Bearer " + (await Auth.getToken(payload, "30d", next));
      return _RS.ok(
        res,
        "SUCCESS",
        "Login successfully",
        { user: isUserExist, token },
        startTime
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * @api {get} /api/user/:id Get user by Id
   * @apiParam {string} id Users unique ID.
   * @apiHeader {String} authorization User's authorized token (i.e "Bearer abcxyz..")
   * @apiName GetUserById
   * @apiGroup User
   * @apiVersion 1.0.0
   */
  static async getProfile(req, res, next) {
    try {
      let user = await User.findOne({
        _id: req.params.id,
      });
      if (!user) {
        return _RS.badRequest(res, "NOTFOUND", "not found", user, startTime);
      }
      return _RS.ok(
        res,
        "SUCCESS",
        "Get Profile Successfully",
        user,
        startTime
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * @api {get} /api/user/users Get all users
   * @apiHeader {String} authorization User's authorized token (i.e "Bearer abcxyz..")
   * @apiName GetAllUsers
   * @apiGroup User
   * @apiVersion 1.0.0
   */
  static async getAllUsers(req, res, next) {
    try {
      const options = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
      };

      let query = [
        {
          $match: {
            role: "user",
            is_active: true,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ];
      var myAggregate = User.aggregate(query);
      const list = await User.aggregatePaginate(myAggregate, options);
      return _RS.ok(res, "SUCCESS", "List", list, startTime);
    } catch (error) {
      next(error);
    }
  }
}
