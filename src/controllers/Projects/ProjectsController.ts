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
export class ProjectsController {

   /**
   * @api {post} /api/projects   Create 
   *  @apiBody {String} name       Name of the User.
   * @apiBody {String} description Project's description.
   * @apiBody {String} start_date  Project's start date in date string (i.e. "2024-06-28T16:35:17.579Z").
   * @apiBody {String} end_date    Project's end date in date string (i.e. "2024-06-28T16:35:17.579Z").
   * @apiHeader {String} authorization User's authorized token (i.e "Bearer abcxyz..")
   * @apiName Create Project
   * @apiGroup Projects
   * @apiVersion 1.0.0
   */
  static async create(req, res, next) {
    try {
      let { name, description, start_date, end_date } = req.body;

      let result = await new Project({
        name,
        description,
        start_date,
        end_date,
      }).save();

      return _RS.created(res, "", "Created Successfully", result);
    } catch (error) {
      next(error);
    }
  }


   /**
   * @api {get} /api/projects/:id Get project by Id
   * @apiParam {string} id Project's unique ID.
   * @apiHeader {String} authorization User's authorized token (i.e "Bearer abcxyz..")
   * @apiName GetUserById
   * @apiGroup Projects
   * @apiVersion 1.0.0
   */
  static async getProject(req, res, next) {
    try {
      let doc = await Project.findOne({ _id: req.params.id, is_active: true });
      if (!doc) {
        return _RS.badRequest(res, "NOTFOUND", "not found", doc, startTime);
      }
      return _RS.ok(res, "SUCCESS", "Get Profile Successfully", doc, startTime);
    } catch (err) {
      next(err);
    }
  }

   /**
   * @api {get} /api/projects/ Get all projects
   * @apiHeader {String} authorization User's authorized token (i.e "Bearer abcxyz..")
   * @apiName getAllProject
   * @apiGroup Projects
   * @apiVersion 1.0.0
   */
  static async getAllProject(req, res, next) {
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
      var myAggregate = Project.aggregate(query);
      const list = await Project.aggregatePaginate(myAggregate, options);
      return _RS.ok(res, "SUCCESS", "List", list, startTime);
    } catch (error) {
      next(error);
    }
  }

   /**
   * @api {put} /api/projects/:id  Update Project By ID
   * @apiParam {string} id Project unique ID.
   *  @apiBody {String} name       Name of the User.
   * @apiBody {String} description Project's description.
   * @apiBody {String} start_date  Project's start date in date string (i.e. "2024-06-28T16:35:17.579Z").
   * @apiBody {String} end_date    Project's end date in date string (i.e. "2024-06-28T16:35:17.579Z").
   * @apiHeader {String} authorization User's authorized token (i.e "Bearer abcxyz..")
   * @apiName Update Project
   * @apiGroup Projects
   * @apiVersion 1.0.0
   */
  static async updateProject(req, res, next) {
    try {
      let doc = await Project.findOne({ _id: req.params.id });
      if (!doc) {
        return _RS.badRequest(res, "NOTFOUND", "not found", doc, startTime);
      }
      let { name, description, start_date, end_date } = req.body;
      (doc.name = name || doc.name),
        (doc.description = description || doc.description),
        (doc.start_date = start_date || doc.start_date),
        (doc.end_date = end_date || doc.end_date);
      doc.save();
      return _RS.ok(res, "SUCCESS", "Updated Successfully", doc, startTime);
    } catch (err) {
      next(err);
    }
  }

   /**
   * @api {delete} /api/projects/:id  Delete Project By ID
   * @apiParam {string} id Project ID.
   * @apiHeader {String} authorization User's authorized token (i.e "Bearer abcxyz..")
   * @apiName Delete Project
   * @apiGroup Projects
   * @apiVersion 1.0.0
   */
  static async removeProject(req, res, next) {
    try {
      let doc = await Project.findOne({ _id: req.params.id, is_active: true });
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
