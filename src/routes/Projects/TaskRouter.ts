import { Router } from "express";
import Authentication from "../../Middlewares/Authnetication";
import AuthValidation from "../../validators/AuthValidation";
import { TaskController } from "../../controllers/Projects/TaskController";

class TaskRouter {
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
      AuthValidation.createTaskValidation,
      TaskController.create
    );
   
  }
  public get() {
    this.router.get(
      "/",
      Authentication.user,
      TaskController.getAllTask
    )

    this.router.get(
      "/:id",
      Authentication.user,
      TaskController.getTask
    )
  }
  public put(){
    this.router.put('/:id', Authentication.admin, TaskController.updateTask);
    this.router.put('/status-update/:id', Authentication.user, TaskController.statusupdate);
  }

  public delete(){
    this.router.delete('/:id', Authentication.admin, TaskController.removeTask)
  }
}

export default new TaskRouter().router;
