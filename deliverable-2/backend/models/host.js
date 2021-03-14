const mongoose = require("mongoose");
const { ObjectID } = require("mongodb");

const HostSchema = new mongoose.Schema({
  name: String,
  phone: String,
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

const Host = mongoose.model("Host", HostSchema);

module.exports = { Host };
