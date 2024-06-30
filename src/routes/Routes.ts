import { Router } from "express";
import AuthRouter from "./Auth/AuthRouter";
import ProjectsRouter from "./Projects/ProjectsRouter";
import TaskRouter from "./Projects/TaskRouter";

class Routes {
  public router: Router;
  constructor() {
    this.router = Router();
    this.app();
  }

  app() {
    this.router.use("/user", AuthRouter);
    this.router.use("/projects", ProjectsRouter)
    this.router.use("/tasks", TaskRouter)

  }
}
export default new Routes().router;
