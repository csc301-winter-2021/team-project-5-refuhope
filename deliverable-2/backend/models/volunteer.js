const mongoose = require("mongoose");

const VolunteerSchema = new mongoose.Schema({
  id: String,
  // TODO: validation for email and password credentials
  email: {
    type: String,
    required: true,
    trim: true, // trim whitespace
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
});

const Volunteer = mongoose.model("Volunteer", VolunteerSchema);

module.exports = { Volunteer };
