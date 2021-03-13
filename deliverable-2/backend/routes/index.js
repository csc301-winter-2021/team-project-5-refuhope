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

// express setup
const port = process.env.PORT || 3000;
const app = express();
// create application/json parser (same functionality as body-parser.json)
app.use(express.json());

/* API routes */
// routes dealing with refugees
// get refugee by id
app.get('/refugeeByID/:id', (req, res) => {
	const id = req.params.id;
	// check if id is valid
	if (!ObjectID.isValid(id)) {
		console.log('invalid');
		return res.status(404).send();
	}
	// find refugee with unique ID and send bad request or not found on failure
	Refugee.findById(id).then((foundRefugee) => {
		if (!foundRefugee) {
			res.status(404).send();
		} else {
			res.send({ foundRefugee });
		}
	}).catch((error) => {
		res.status(400).send(error);
	});
})

// get refugee with specified name in search
app.get('/refugeeSearch/:name', (req, res) => {
	const refugeeName = req.params.name;
	// find one refugee with given name and send bad request on failure
	Refugee.findOne({ name:refugeeName }).then(foundRefugee => {
		res.send({ foundRefugee })
	}, (error) => {
		res.status(400).send(error)
	})
})

// get all registered refugees (useful for refugee dashboard page)
app.get('/refugeeSearch', (req, res) => {
	// find all refugees registered in db and send bad request on failure
	Refugee.find().then((allRefugees) => {
		res.send({ allRefugees })
	}, (error) => {
		res.status(400).send(error)
	})
})

// add a new refugee to db 
app.post('/refugeeAdd', (req, res) => {
	// console.log(req.body);
	// default to unavailable
	const dailySchedule = new Day({
		available: false,
		hours: []
	})
	// create a empty schedule (TODO: task#27) - open to feedback for how schedule should be passed/initialized
	const refugeeSchedule = new Schedule({
		mon: dailySchedule,
		tues: dailySchedule,
		wed: dailySchedule,
		thurs: dailySchedule,
		fri: dailySchedule,
		sat: dailySchedule,
		sun: dailySchedule
	});
	// ensure that work type is only one of "TUTORING" or "GROCERIES"
	const possibleTypes = ['TUTORING', 'GROCERIES'];
	if (!possibleTypes.includes(req.body.workType)) {
		throw new Error('Invalid work type')
	}
	// create a new refugee assuming req follows schema
	const newRefugee = new Refugee({
		name: req.body.name,
		phone: req.body.phone,
		email: req.body.email,
		city: req.body.city,
    	province: req.body.prov,
		workType: req.body.workType,
		schedule: refugeeSchedule,
		numWorkHours: req.body.numWorkHours
	});
	// save new refugee to DB
	newRefugee.save().then(result => {
		// save and send object that was saved
		res.send({ result })
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
