const mongoose = require("mongoose");
const { ScheduleSchema } = require("./schedule");
const { ObjectID } = require("mongodb");

const WORK_TYPES = ["TUTORING", "GROCERIES"]
const STATUS_TYPES = ["MATCHED", "IN REVIEW", "REJECTED"]

const OpportunitySchema = new mongoose.Schema({
  poster: { // ID of host
    type: ObjectID,
    required: true
  },
  title: {
    type: String,
    maxlength: 100,
    required: true
  },
  additionalInfo: {
    type: String,
    maxlength: 500
  },
  city: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true
  },
  workType: {
    type: String,
    enum: WORK_TYPES,
    required: true
  },
  schedule: ScheduleSchema,
  numWorkHours: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: STATUS_TYPES,
    required: true
  },
  matchedRefugee: ObjectID // ID of refugee
});

const Opportunity = mongoose.model("Opportunity", OpportunitySchema);

module.exports = { Opportunity, WORK_TYPES, STATUS_TYPES };
