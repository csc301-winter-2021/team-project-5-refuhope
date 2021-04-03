const express = require("express");
const router = express.Router();

const { ObjectID } = require("mongodb");
const { Opportunity } = require("../models/opportunity");
const { User } = require("../models/user");
const { constructScheduleQuery } = require("./helpers");

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
  Opportunity.find({ poster: posterId })
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

router.get("/api/opportunityByRefugee/:refugee", (req, res) => {
  const refugeeId = req.params.refugee;
  // check if id is valid
  if (!ObjectID.isValid(refugeeId)) {
    return res.status(404).send();
  }
  // find opportunity matched with specific refugee
  Opportunity.find({ matchedRefugee: refugeeId })
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

// get all opportunities
// `schedule` query should look like: mon:11-14,15-18;tues:10-14
// `subjects` query should look like: MATH,BIOLOGY,HISTORY
router.get("/api/opportunitySearch", (req, res) => {
  const { schedule, subjects } = req.query;
  const filterQuery = req.query;
  delete filterQuery.schedule;
  delete filterQuery.subjects;
  
  // handle filtering by schedule
  if (schedule) {
    filterQuery.$or = constructScheduleQuery(schedule);
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
  // create dailySchedule objects for each weekday based on input, storing hour of interval
  const dailySchedules = req.body.schedule.map(day => {
    if (day.includes('')){
      return({ available: false, hours: [] })
    } else {
      return({ available: true, hours: [{ start: parseInt(day[0]), end: parseInt(day[1]) }] })
    }
  })
  // create and populate a schedule (TODO: task#27) - open to feedback for how schedule should be passed/initialized
  const schedule = {
    mon: dailySchedules[0],
    tues: dailySchedules[1],
    wed: dailySchedules[2],
    thurs: dailySchedules[3],
    fri: dailySchedules[4],
    sat: dailySchedules[5],
    sun: dailySchedules[6],
  };
  const userEmail = req.session.user;
  // find the user that the given user email identifies
  User.findOne({ email: userEmail }).then(
    (foundUser) => {
      if (!foundUser) {
        res.status(404).send();
      }
      // create a new opportunity assuming req follows schema
      const newOpportunity = new Opportunity({
        ...req.body,
        poster: foundUser.id,
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
    },
    (error) => {
      res.status(400).send({ error });
    }
  );
});

// export the router
module.exports = router;
