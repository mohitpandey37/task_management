import { Router } from "express";
import UploadFiles from "../Middlewares/FileUploadMiddleware";
import Authentication from "../Middlewares/Authnetication";
import { CommonController } from "../controllers/CommonController";
class CommonRouter {
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
      "/file-upload",
      UploadFiles.upload,
      CommonController.uploadImage
    );
  }

  public get() {
  }

  public put() {}

  public delete() {
    this.router.delete("/remove-file", CommonController.removeImage);
  }
}

export default new CommonRouter().router;
