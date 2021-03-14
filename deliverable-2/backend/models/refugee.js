const mongoose = require("mongoose");
const { ScheduleSchema } = require("./schedule");

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

module.exports = { Refugee };
