const express = require("express");
const router = express.Router();

const { ObjectID } = require("mongodb");
const { Opportunity } = require("../models/opportunity");

router.get("/api/opportunityByID/:id", (req, res) => {
  const id = req.params.id;
  // check if id is valid
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  // find opportunity with unique ID
  Opportunity.findById(id)
    .then((foundOpportunity) => {
      if (!foundOpportunity) {
        res.status(404).send();
      } else {
        res.send({ response: foundOpportunity });
      }
    })
    .catch((error) => {
      res.status(400).send({ error });
    });
});

router.get("/api/opportunityByPoster/:poster", (req, res) => {
  const posterId = req.params.poster;
  // check if id is valid
  if (!ObjectID.isValid(posterId)) {
    return res.status(404).send();
  }
  // find opportunity made by specific poster
  Opportunity.find({ poster: posterId }).then(foundOpportunity => {
      if (!foundOpportunity) {
        res.status(404).send();
      } else {
        res.send({ response: foundOpportunity });
      }
    })
    .catch((error) => {
      res.status(400).send({ error });
    });
});

router.get("/api/opportunityByRefugee/:refugee", (req, res) => {
  const refugeeId = req.params.refugee;
  // check if id is valid
  if (!ObjectID.isValid(refugeeId)) {
    return res.status(404).send();
  }
  // find opportunity matched with specific refugee
  Opportunity.find({ matchedRefugee: refugeeId }).then(foundOpportunity => {
      if (!foundOpportunity) {
        res.status(404).send();
      } else {
        res.send({ response: foundOpportunity });
      }
    })
    .catch((error) => {
      res.status(400).send({ error });
    });
});

// get all opportunities
router.get("/api/opportunitySearch", (req, res) => {
  // TODO: Add support to query opportunities by various fields (task#31)
  Opportunity.find().then(
    (allOpportunities) => {
      res.send({ response: allOpportunities });
    },
    (error) => {
      res.status(400).send({ error });
    }
  );
});

router.post("/api/opportunityAdd", (req, res) => {
  const dailySchedule = {
    available: false,
    hours: [],
  };
  // create a empty schedule (TODO: task#27) - open to feedback for how schedule should be passed/initialized
  const schedule = {
    mon: dailySchedule,
    tues: dailySchedule,
    wed: dailySchedule,
    thurs: dailySchedule,
    fri: dailySchedule,
    sat: dailySchedule,
    sun: dailySchedule,
  };
  // create a new opportunity assuming req follows schema
  const newOpportunity = new Opportunity({
    ...req.body,
    poster: new ObjectID(), // TODO: once cookies are added, get poster id from session (task#32)
    schedule: schedule,
    status: "IN REVIEW" // new opportunities should be "IN REVIEW"
  });
  newOpportunity.save().then(
    (result) => {
      res.send({ response: result });
    },
    (error) => {
      // 400 for bad request
      res.status(400).send({ error });
    }
  );
});

// export the router
module.exports = router;
