const express = require("express");
const router = express.Router();

const { ObjectID } = require("mongodb");
const { Refugee } = require("../models/refugee");
const { Opportunity } = require("../models/opportunity");
const { constructScheduleQuery } = require("./helpers");

// get refugee by id
router.get("/api/refugeeByID/:id", (req, res) => {
	const id = req.params.id;
	// check if id is valid
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}
	// find refugee with unique ID and send bad request or not found on failure
	Refugee.findById(id).then((foundRefugee) => {
		if (!foundRefugee) {
			res.status(404).send();
		} else {
			res.send({ response: foundRefugee });
		}
	}).catch((error) => {
		res.status(400).send({ error });
	});
});

// get refugee with specified name in search
router.get("/api/refugeeSearch/:name", (req, res) => {
	const refugeeName = req.params.name;
	// find one refugee with given name and send bad request on failure
	Refugee.findOne({ name: refugeeName }).then((foundRefugee) => {
		res.send({ response: foundRefugee });
	}, (error) => {
		res.status(400).send({ error });
	});
});

// get all registered refugees (useful for refugee dashboard page)
router.get("/api/refugeeSearch", (req, res) => {
	// find all refugees registered in db and send bad request on failure
	const { schedule } = req.query;
	const filterQuery = req.query;
  delete filterQuery.schedule;

	if (schedule) {
    filterQuery.$or = constructScheduleQuery(schedule);
  }
	Refugee.find({ ...filterQuery }).then((allRefugees) => {
		res.send({ response: allRefugees })
	}, (error) => {
		res.status(400).send({ error })
	});
});

router.get("/api/refugeeMatches", async (req, res) => {
	const { match } = req.query;
	const filterQuery = req.query;
	delete filterQuery.match;

	let matchedRefugees;
	if (match) {
		if (!ObjectID.isValid(match)) {
			res.status(400).send({ error: "Invalid ID for `match` field" });
			return;
		}
		matchedRefugees = await Refugee.aggregate([
			{
				$lookup: {
					from: 'opportunities',
					localField: '_id',
					foreignField: 'matchedRefugee',
					as: 'opportunity'
				}
			},
			{ $unwind: '$opportunity' },
			{ $match: { ["opportunity._id"]: new ObjectID(match) } },
			{ $unset: "opportunity" }
		]);
	} else {
		matchedRefugees = await Refugee.aggregate([
			{
				$lookup: {
					from: 'opportunities',
					localField: '_id',
					foreignField: 'matchedRefugee',
					as: 'opportunity'
				}
			},
			{ $match: { opportunity: { $size: 0 } } },
			{ $unset: "opportunity" }
		]);
	}

	res.send({ response: matchedRefugees });
});

// add a new refugee to db 
router.post("/api/refugeeAdd", (req, res) => {
	const dailySchedule = {
		available: false,
		hours: []
	};
	// create a empty schedule (TODO: task#27) - open to feedback for how schedule should be passed/initialized
	const refugeeSchedule = {
		mon: dailySchedule,
		tues: dailySchedule,
		wed: dailySchedule,
		thurs: dailySchedule,
		fri: dailySchedule,
		sat: dailySchedule,
		sun: dailySchedule
	};
	// create a new refugee assuming req follows schema
	const newRefugee = new Refugee({
		name: req.body.name,
		phone: req.body.phone,
		email: req.body.email,
		city: req.body.city,
		province: req.body.prov,
		additionalInfo: req.body.additionalInfo,
		workType: req.body.workType,
		schedule: refugeeSchedule,
		numWorkHours: req.body.numWorkHours
	});
	// save new refugee to DB
	newRefugee.save().then((result) => {
		// save and send object that was saved
		res.send({ response: result });
	}, (error) => {
    	// 400 for bad request
		res.status(400).send({ error }); 
	});
});

// export the router
module.exports = router;
