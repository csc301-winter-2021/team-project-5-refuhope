const mongoose = require("mongoose");
const { ScheduleSchema } = require("./schedule");

const WORK_TYPES = ["TUTORING", "GROCERIES"];

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
  additionalInfo: {
    type: String,
    maxlength: 500
  },
  schedule: ScheduleSchema,
  numWorkHours: Number
});

const Refugee = mongoose.model("Refugee", RefugeeSchema);

module.exports = { Refugee };
