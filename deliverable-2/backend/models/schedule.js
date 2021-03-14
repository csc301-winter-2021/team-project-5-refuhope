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

module.exports = { ScheduleSchema };
