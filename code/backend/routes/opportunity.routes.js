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
// `schedule` query should look like: mon:11-14,15-18;tues:10-14
// `subjects` query should look like: MATH,BIOLOGY,HISTORY
router.get("/api/opportunitySearch", (req, res) => {
  // TODO: Add support to query opportunities by various fields (task#31)
  const { schedule, subjects } = req.query;
  filterQuery = req.query;
  delete filterQuery.schedule;
  delete filterQuery.subjects;
  
  // handle filtering by schedule
  if (schedule) {
    scheduleOverlapQuery = []
    schedMongoQuery = schedule.split(";").forEach((daySched) => {
      const ind = daySched.indexOf(":")
      const day = daySched.substring(0, ind);
      daySched.substring(ind+1).split(",").forEach((interval) => {
        const start = Number.parseInt(interval.split("-")[0]);
        const end = Number.parseInt(interval.split("-")[1]);

        scheduleOverlapQuery.push({ $and: [
          {[`schedule.${day}.hours.start`]: {$lte: end}},
          {[`schedule.${day}.hours.end`]: {$gte: start}}
        ]});
      });
    });
    filterQuery.$or = scheduleOverlapQuery
  }
  // handle filtering by subject
  if (subjects) {
    filterQuery.subjects = {$in: subjects.split(",")}
  }
  Opportunity.find({ ...filterQuery }).then(
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
