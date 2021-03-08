const mongoose = require("mongoose");
const { Opportunity } = require("./opportunity");

const HostSchema = new mongoose.Schema({
  id: String,
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
  },
  posted_opportunities: [Opportunity]
});

const Host = mongoose.model("Host", HostSchema);

module.exports = { Host };
