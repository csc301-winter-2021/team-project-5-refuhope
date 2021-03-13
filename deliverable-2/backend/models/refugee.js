const mongoose = require("mongoose");

// representation of schedule - open to changes
const DaySchema = new mongoose.Schema({
  available: {
    type: Boolean,
    default: false
  },
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

const RefugeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }, 
  phone: {
    type: String,
    required: true
  }, 
  email: {
    type: String,
    required: true
  }, 
  city: String,
  province: String,
  workType: {
    type: String,
    enum: ["TUTORING", "GROCERIES"]
  },
  schedule: ScheduleSchema,
  numWorkHours: Number
});

const Refugee = mongoose.model("Refugee", RefugeeSchema);
const Schedule = mongoose.model("Schedule", ScheduleSchema);
const Day = mongoose.model("Day", DaySchema);

module.exports = { Refugee, Schedule, Day };
