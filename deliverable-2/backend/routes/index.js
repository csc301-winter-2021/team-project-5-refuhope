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
const { Refugee, Schedule, Day } = require('../models/refugee')

// express
const port = process.env.PORT || 3000;
const app = express();

/* API routes */
// routes dealing with refugees

// add a new refugee to db 
app.post('/refugeeAdd', (req, res) => {
	console.log(req.body);
	// default to unavailable
	const dailySchedule = new Day({
		available: false,
		hours: []
	})
	// create a empty schedule (TODO: fix) - open to feedback for how schedule should be passed/initialized
	const refugeeSchedule = new Schedule({
		mon: dailySchedule,
		tues: dailySchedule,
		wed: dailySchedule,
		thurs: dailySchedule,
		fri: dailySchedule,
		sat: dailySchedule,
		sun: dailySchedule
	});
	// create a new refugee assuming req follows schema
	const newRefugee = new Refugee({
		name: req.body.name,
		phone: req.body.phone,
		city: req.body.city,
    	province: req.body.prov,
		workType: req.body.workType,
		schedule: refugeeSchedule,
		numWorkHours: req.body.numWorkHours
	});
	// save new refugee to DB
	newRefugee.save().then(result => {
		// save and send object that was saved
		res.send({result})
	}, (error) => {
    	// 400 for bad request
		res.status(400).send(error) 
	});
});

// host routes

// volunteer opportunity routes

// UI routes
app.use(express.static(path.join(path.resolve(__dirname, '../..'), './frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(path.resolve(__dirname, '../..'), './frontend/build/index.html'));
});

// listen for requests
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
