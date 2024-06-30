import { ref } from "joi";
import * as mongoose from "mongoose";
import { model, AggregatePaginateModel } from "mongoose";
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;
const Project = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    is_active: { type: Boolean, default: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

mongoose.plugin(aggregatePaginate);

export default model<any, AggregatePaginateModel<any>>("Project", Project);
