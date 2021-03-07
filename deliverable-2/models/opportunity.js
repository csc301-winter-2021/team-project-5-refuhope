const mongoose = require("mongoose");
const { Host } = require("./host");
const { Refugee } = require("./refugee");

const OpportunitySchema = new mongoose.Schema({
  id: String,
  poster: Host,
  title: String,
  city: String,
  province: String,
  work_type: {
    type: String,
    enum: ["TUTORING", "GROCERIES"]
  },
  // TODO: change schedule data type
  schedule: DailyScheduleSchema,
  num_work_hours: Number,
  status: {
    type: String,
    enum: ["MATCHED", "IN REVIEW", "REJECTED"]
  },
  matched_refugee: Refugee
});

// temporary representation of schedule
const DailyScheduleSchema = new mongoose.Schema({
  mon: [{ start: Number, end: Number }],
  tues: [{ start: Number, end: Number }],
  wed: [{ start: Number, end: Number }],
  thurs: [{ start: Number, end: Number }],
  fri: [{ start: Number, end: Number }],
  sat: [{ start: Number, end: Number }],
  sun: [{ start: Number, end: Number }]
});

const Opportunity = mongoose.model("Opportunity", OpportunitySchema);

module.exports = { Opportunity };
