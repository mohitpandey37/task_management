import * as Joi from "joi";
import { NextFunction } from "express";
import { validate } from "../helpers/ValidationHelper";
import { ReqInterface, ResInterface } from "../interfaces/RequestInterface";

class AuthValidation {
  static async loginValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction
  ) {
    const schema = Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    });
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }

  static async signUpValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction
  ) {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      role: Joi.string().required(),
      password: Joi.string()
        .required()
        .pattern(/^[a-zA-Z0-9]+/),

});
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }


  static async createProjectValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction
  ) {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      description: Joi.string().optional().allow("", null),
      start_date: Joi.string().required(),
      end_date: Joi.string().required(),
});
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }

  static async createTaskValidation(
    req: ReqInterface,
    res: ResInterface,
    next: NextFunction
  ) {
    const schema = Joi.object().keys({
      title: Joi.string().required(),
      description: Joi.string().optional().allow("", null),
      due_date: Joi.string().required(),
      priority: Joi.string().required(),
      project: Joi.string().required(),
      user: Joi.string().required()
});
    const isValid = await validate(req.body, res, schema);
    if (isValid) {
      next();
    }
  }
  
  

}

export default AuthValidation;
