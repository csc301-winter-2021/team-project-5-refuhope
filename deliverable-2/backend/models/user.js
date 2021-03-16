const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  name: String,
  phone: String,
  // TODO: validation for email and password credentials
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: {
		validator: validator.isEmail,
		message: 'Non-valid email'
	}
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  userType: {
    type: String,
    enum: ["HOST", "VOLUNTEER"]
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = { User };
