import { ref } from "joi";
import * as mongoose from "mongoose";
import { model, AggregatePaginateModel } from "mongoose";
import User from "./User";
import Project from "./Project";
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;
const Tasks = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    is_active: { type: Boolean, default: true },
    priority: {
      type: String,
      enum: ["first", "second"],
      default: "first",
    },
    due_date: { type: Date, required: true },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Project,
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

mongoose.plugin(aggregatePaginate);

export default model<any, AggregatePaginateModel<any>>("Tasks", Tasks);
