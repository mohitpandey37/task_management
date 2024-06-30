import { ref } from "joi";
import * as mongoose from "mongoose";
import { model, AggregatePaginateModel } from "mongoose";
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;
const User = new Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        password: {
            type: String,
        },
        role: { type: String, enum: ['admin', 'manager', 'user'], default: 'user' 
        },
        is_active: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    }
);

mongoose.plugin(aggregatePaginate);

export default model<any, AggregatePaginateModel<any>>("User", User);

