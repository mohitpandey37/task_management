import { Router } from "express";
import Authentication from "../../Middlewares/Authnetication";
import AuthValidation from "../../validators/AuthValidation";
import { ProjectsController } from "../../controllers/Projects/ProjectsController";

class ProjectRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.post();
    this.get();
    this.put();
    this.delete();
  }

  public post() {
    this.router.post(
      "/",
      Authentication.admin,
      AuthValidation.createProjectValidation,
      ProjectsController.create
    );
   
  }
  public get() {
    this.router.get(
      "/",
      Authentication.user,
      ProjectsController.getAllProject
    )

    this.router.get(
      "/:id",
      Authentication.user,
      ProjectsController.getProject
    )
  }
  public put(){
    this.router.put('/:id', Authentication.admin, ProjectsController.updateProject)
  }

  public delete(){
    this.router.delete('/:id', Authentication.admin, ProjectsController.removeProject)
  }
}

export default new ProjectRouter().router;
