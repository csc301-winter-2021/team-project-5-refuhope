const mongoose = require("mongoose");

// TODO: setup mongoose connection
const mongoDB = process.env.MONGODB_URI || 'mongodb://localhost:27017/RefuTalent_API';

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

module.exports = {
  mongoose
};
