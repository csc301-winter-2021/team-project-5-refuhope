/* Main server for API functionality */
const express = require('express');
const path = require('path');

// import our mongoose connection
const mongoose = require('../db/mongoose');
const { ObjectID } = require('mongodb');
// import mongoose schema models
// const { Volunteer } = require('../models/volunteer')
// const { Opportunity } = require('../models/opportunity')
// const { Host } = require('../models/host')

// express setup
const port = process.env.PORT || 3000;
const app = express();
// create application/json parser (same functionality as body-parser.json)
app.use(express.json());

/* API routes */
// refugee routes
app.use(require('./refugee.routes'));
// host routes

// volunteer opportunity routes
app.use(require('./opportunity.routes'));

// UI routes
app.use(express.static(path.join(path.resolve(__dirname, '../..'), './frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(path.resolve(__dirname, '../..'), './frontend/build/index.html'));
});

// listen for requests
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
