const mongoose = require("mongoose");

const hourSchema = new mongoose.SchemaType({
  type: Number,
  validate: {
    validator: (v) => Number.isInteger(v) && 0 <= v <= 23,
    message: "{VALUE} is not a valid hour (24h format)."
  },
  required: true
});
const minuteSchema = new mongoose.SchemaType({
  type: Number,
  validate: {
    validator: (v) => Number.isInteger(v) && 0 <= v <= 59,
    message: "{VALUE} is not a valid minute."
  },
  required: true
});

const ScheduleSchema = new mongoose.Schema({
  mon: {
    type: {
      startHour: hourSchema,
      startMinute: minuteSchema,
      endHour: hourSchema,
      endMinute: minuteSchema
    },
    validate: {
      validator: (v) => v.startHour <= v.endHour && v.startHour == v.endHour ? v.startMinute <= v.endMinute : true,
      message: "Start time is not before end time."
    }
  },
  tues: {
    type: {
      startHour: hourSchema,
      startMinute: minuteSchema,
      endHour: hourSchema,
      endMinute: minuteSchema
    },
    validate: {
      validator: (v) => v.startHour <= v.endHour && v.startHour == v.endHour ? v.startMinute <= v.endMinute : true,
      message: "Start time is not before end time."
    }
  },
  wed: {
    type: {
      startHour: hourSchema,
      startMinute: minuteSchema,
      endHour: hourSchema,
      endMinute: minuteSchema
    },
    validate: {
      validator: (v) => v.startHour <= v.endHour && v.startHour == v.endHour ? v.startMinute <= v.endMinute : true,
      message: "Start time is not before end time."
    }
  },
  thurs: {
    type: {
      startHour: hourSchema,
      startMinute: minuteSchema,
      endHour: hourSchema,
      endMinute: minuteSchema
    },
    validate: {
      validator: (v) => v.startHour <= v.endHour && (v.startHour == v.endHour ? v.startMinute <= v.endMinute : true),
      message: "Start time is not before end time."
    }
  },
  fri: {
    type: {
      startHour: hourSchema,
      startMinute: minuteSchema,
      endHour: hourSchema,
      endMinute: minuteSchema
    },
    validate: {
      validator: (v) => v.startHour <= v.endHour && v.startHour == v.endHour ? v.startMinute <= v.endMinute : true,
      message: "Start time is not before end time."
    }
  },
  sat: {
    type: {
      startHour: hourSchema,
      startMinute: minuteSchema,
      endHour: hourSchema,
      endMinute: minuteSchema
    },
    validate: {
      validator: (v) => v.startHour <= v.endHour && v.startHour == v.endHour ? v.startMinute <= v.endMinute : true,
      message: "Start time is not before end time."
    }
  },
  sun: {
    type: {
      startHour: hourSchema,
      startMinute: minuteSchema,
      endHour: hourSchema,
      endMinute: minuteSchema
    },
    validate: {
      validator: (v) => v.startHour <= v.endHour && v.startHour == v.endHour ? v.startMinute <= v.endMinute : true,
      message: "Start time is not before end time."
    }
  }
});

module.exports = { ScheduleSchema };
