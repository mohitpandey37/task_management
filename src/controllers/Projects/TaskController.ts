import _RS from "../../helpers/ResponseHelper";
import Auth from "../../helpers/Auth";
import User from "../../models/User";
import { start } from "repl";
import Project from "../../models/Project";
import Task from "../../models/Task";
const express = require("express");
const cookieParser = require("cookie-parser");
const startTime = new Date().getTime();
const app = express();

app.use(cookieParser());
export class TaskController {
  /**
   * @api {post} /api/tasks        Create
   *  @apiBody {String} title      Title of the task.
   * @apiBody {String} description Task's description.
   * @apiBody {String} due_date    Task's Due date in date string (i.e. "2024-06-28T16:35:17.579Z").
   * @apiBody {String} priority    Task's priority (i.e "first" or "second")
   * @apiBody {String} project     Project ID to which task is associated
   * @apiBody {String} priority    User ID to which task is assigned
   * @apiHeader {String} authorization User's authorized token (i.e "Bearer abcxyz..")
   * @apiName Create Task
   * @apiGroup Tasks
   * @apiVersion 1.0.0
   */
  static async create(req, res, next) {
    try {
      let { title, description, due_date, priority, project, user } = req.body;
      let result = await new Task({
        title,
        description,
        due_date,
        priority,
        project,
        user,
      }).save();

      return _RS.created(res, "", "Created Successfully", result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @api {get} /api/tasks/:id Get task by Id
   * @apiParam {string} id Task's unique ID.
   * @apiHeader {String} authorization User's authorized token (i.e "Bearer abcxyz..")
   * @apiName getTask
   * @apiGroup Tasks
   * @apiVersion 1.0.0
   */
  static async getTask(req, res, next) {
    try {
      let doc = await Task.findOne({ _id: req.params.id, is_active: true })
        .populate("project", "-__v -createdAt -updatedAt")
        .populate("user", "-__v -password -createdAt -updatedAt");
      if (!doc) {
        return _RS.badRequest(res, "NOTFOUND", "not found", doc, startTime);
      }
      return _RS.ok(res, "SUCCESS", "Get Profile Successfully", doc, startTime);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @api {get} /api/tasks Get all Tasks
   * @apiHeader {String} authorization User's authorized token (i.e "Bearer abcxyz..")
   * @apiName getAllTask
   * @apiGroup Tasks
   * @apiVersion 1.0.0
   */
  static async getAllTask(req, res, next) {
    try {
      const options = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
      };

      let query = [
        {
          $match: {
            is_active: true,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ];
      var myAggregate = Task.aggregate(query);
      const list = await Task.aggregatePaginate(myAggregate, options);
      return _RS.ok(res, "SUCCESS", "List", list, startTime);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @api {put} /api/tasks/:id        Update task by ID
   * @apiParam {string} id Task ID.
   *  @apiBody {String} title      Title of the task.
   * @apiBody {String} description Task's description.
   * @apiBody {String} due_date    Task's Due date in date string (i.e. "2024-06-28T16:35:17.579Z").
   * @apiBody {String} priority    Task's priority (i.e "first" or "second")
   * @apiBody {String} project     Project ID to which task is associated
   * @apiBody {String} priority    User ID to which task is assigned
   * @apiHeader {String} authorization User's authorized token (i.e "Bearer abcxyz..")
   * @apiName Update Task
   * @apiGroup Tasks
   * @apiVersion 1.0.0
   */
  static async updateTask(req, res, next) {
    try {
      let doc = await Task.findOne({ _id: req.params.id });
      if (!doc) {
        return _RS.badRequest(res, "NOTFOUND", "not found", doc, startTime);
      }
      let { title, description, due_date, priority, project, user } = req.body;
      (doc.name = title || doc.title),
        (doc.description = description || doc.description),
        (doc.due_date = due_date || doc.due_date),
        (doc.priority = priority || doc.priority),
        (doc.project = project || doc.project),
        (doc.user = user || doc.user);
      doc.save();
      return _RS.ok(res, "SUCCESS", "Updated Successfully", doc, startTime);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @api {delete} /api/tasks/:id  Delete Task By ID
   * @apiParam {string} id Task ID.
   * @apiHeader {String} authorization User's authorized token (i.e "Bearer abcxyz..")
   * @apiName Delete Project
   * @apiGroup Tasks
   * @apiVersion 1.0.0
   */
  static async removeTask(req, res, next) {
    try {
      let doc = await Task.findOne({ _id: req.params.id, is_active: true });
      if (!doc) {
        return _RS.badRequest(res, "NOTFOUND", "not found", doc, startTime);
      }
      doc.is_active = false;
      doc.save();
      return _RS.ok(res, "SUCCESS", "Removed Successfully", {}, startTime);
    } catch (err) {
      next(err);
    }
  }
}
