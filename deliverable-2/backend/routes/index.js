/* Main server for API functionality */
const express = require('express');
const path = require('path');

// import our mongoose connection
const mongoose = require('../db/mongoose');

// express setup
const port = process.env.PORT || 3000;
const app = express();
// create application/json parser (same functionality as body-parser.json)
app.use(express.json());

/* API routes */
// refugee routes
app.use(require('./refugee.routes'));

// user routes
app.use(require('./user.routes'));

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
