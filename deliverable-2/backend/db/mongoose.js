const mongoose = require("mongoose");

// TODO: setup mongoose connection
const mongoDB = process.env.MONGODB_URI || 'mongodb://localhost:27017/RefuTalent_API';

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

// test db connection
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('connected to database: ', mongoDB))

module.exports = {
  mongoose
};
