const mongoose = require("mongoose");

const RefugeeSchema = new mongoose.Schema({
  id: String,
  name: String,
  phone: String,
  email: String,
  city: String,
  province: String,
  work_type: String,
  // TODO: change schedule data type
  schedule: DailyScheduleSchema,
  num_work_hours: Number
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

const Refugee = mongoose.model("Refugee", RefugeeSchema);

module.exports = { Refugee };
