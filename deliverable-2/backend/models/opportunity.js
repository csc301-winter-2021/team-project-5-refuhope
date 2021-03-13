const mongoose = require("mongoose");
const { Host } = require("./host");
const { Refugee } = require("./refugee");

// representation of schedule - open to changes
const DaySchema = new mongoose.Schema({
  available: Boolean,
  hours: [{start: Number, end: Number}]
})

const ScheduleSchema = new mongoose.Schema({
  mon: DaySchema,
  tues: DaySchema,
  wed: DaySchema,
  thurs: DaySchema,
  fri: DaySchema,
  sat: DaySchema,
  sun: DaySchema
});

const OpportunitySchema = new mongoose.Schema({
  id: String,
  poster: Host,
  title: String,
  city: String,
  province: String,
  workType: {
    type: String,
    enum: ["TUTORING", "GROCERIES"]
  },
  // TODO: change schedule data type
  schedule: ScheduleSchema,
  numWorkHours: Number,
  status: {
    type: String,
    enum: ["MATCHED", "IN REVIEW", "REJECTED"]
  },
  matchedRefugee: Refugee
});

const Opportunity = mongoose.model("Opportunity", OpportunitySchema);

module.exports = { Opportunity };
