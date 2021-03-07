/* Main server for API functionality */
const express = require('express');

// import our mongoose connection
const mongoose = require('../db/mongoose');
// import mongoose schema models
// const { Volunteer } = require('../models/volunteer')
// const { Opportunity } = require('../models/opportunity')
// const { Host } = require('../models/host')
// const { Refugee } = require('../models/refugee')

// express
const port = process.env.PORT || 3000;
const app = express();

/* API routes go here */
// test root route
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// TODO: Refugee routes

// TODO: Host Routes 

// TODO: Volunteer opportunity routes

// listen for requests
app.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});

