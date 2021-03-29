const mongoose = require("mongoose");
const { ScheduleSchema } = require("./schedule");
const { ObjectID } = require("mongodb");

const WORK_TYPES = ["TUTORING", "GROCERIES"]
const STATUS_TYPES = ["MATCHED", "IN REVIEW", "REJECTED"]

const OpportunitySchema = new mongoose.Schema(
  {
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
  },
  { discriminatorKey: "workType" }
);

const Opportunity = mongoose.model("Opportunity", OpportunitySchema);


const SUBJECTS = [
  "MATH",
  "BIOLOGY",
  "CHEMISTRY",
  "PHYSICS",
  "ENGLISH",
  "SOCIAL STUDIES",
  "HISTORY",
  "GEOGRAPHY",
  "COMPUTER SCIENCE"
];

const TutoringOpportunity = Opportunity.discriminator(
  "TUTORING",
  new mongoose.Schema({
    subjects: {
      type: [
        {
          type: String,
          enum: SUBJECTS
        }
      ],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "Must have at least one subject."
      }
    },
    gradeLevel: {
      type: Number,
      validate : {
        validator: (v) => Number.isInteger(v) && 1 <= v && v <= 13,
        message: "{VALUE} is not a valid grade level."
      },
      required: true
    }
  })
);

const GroceriesOpportunity = Opportunity.discriminator(
  "GROCERIES",
  new mongoose.Schema({
    hasCar: {
      type: Boolean,
      required: true
    },
    hasPhone: {
      type: Boolean,
      required: true
    }
  })
);


module.exports = { Opportunity, TutoringOpportunity, GroceriesOpportunity, WORK_TYPES, STATUS_TYPES };
