const express = require("express");
const router = express.Router();

const { ObjectID } = require("mongodb");
const { User } = require("../models/user");

// get host user by id
router.get("/api/userByID/:id", (req, res) => {
	const id = req.params.id;
	// check if id is valid
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}
	// find host user with unique ID and send bad request or not found on failure
	User.findById(id).then((foundUser) => {
		if (!foundUser) {
			res.status(404).send();
		} else {
			res.send({ foundUser });
		}
	}).catch((error) => {
		res.status(400).send({ error });
	});
});

// get registered user with email if it exists
router.get('/api/userSearch/:email', (req, res) => {
	const searchedEmail = req.params.email;
	// find the user that the given email identifies
	User.findOne({ email: searchedEmail }).then((foundUser) => {
		res.send({ foundUser });
	}, (error) => {
		res.status(400).send(error);
	})
})

// get all registered users in the system - mostly good for debugging 
router.get('/api/userSearch', (req, res) => {
	// find all users registered in db and send bad request on failure
    User.find().then((allUsers) => {
		res.send({ allUsers });
	}, (error) => {
		res.status(400).send(error);
	});
});

// TODO: Task#35 - add user routes involving session (e.g. get logged-in user, logout - destroy session)

// export the router
module.exports = router;
