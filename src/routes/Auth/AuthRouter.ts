import { Router } from "express";
import Authentication from "../../Middlewares/Authnetication";
import AuthValidation from "../../validators/AuthValidation";
import { UserAuthController } from "../../controllers/User/UserAuthController";

class AuthRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
  }

  public post() {
    this.router.post(
      "/register",
      AuthValidation.signUpValidation,
      UserAuthController.register
    );

    this.router.post(
      "/login",
      AuthValidation.loginValidation,
      UserAuthController.login
    );
   
  }
  public get() {
    this.router.get(
      "/users",
      Authentication.admin,
      UserAuthController.getAllUsers
    )

    this.router.get(
      "/:id",
      Authentication.user,
      UserAuthController.getProfile
    )
  }

}

export default new AuthRouter().router;
