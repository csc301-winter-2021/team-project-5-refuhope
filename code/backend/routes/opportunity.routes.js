const express = require("express");
const router = express.Router();

const { ObjectID } = require("mongodb");
const { Opportunity, getModel } = require("../models/opportunity");
const { User } = require("../models/user");
const { constructScheduleQuery, processId } = require("./helpers");

router.get("/api/opportunities/:id", (req, res) => {
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

// get all opportunities
// `schedule` query should look like: mon:11.00-14.30,15.00-18.00;tues:10.20-14.45
// `subjects` query should look like: MATH,BIOLOGY,HISTORY
router.get("/api/opportunities", (req, res) => {
  const { schedule, subjects } = req.query;
  const filterQuery = req.query;
  delete filterQuery.schedule;
  delete filterQuery.subjects;

  // handle filtering by an ID
  try {
    processId("_id", filterQuery._id, filterQuery);
    processId("poster", filterQuery.poster, filterQuery);
    processId("matchedRefugee", filterQuery.matchedRefugee, filterQuery);
  } catch (e) {
    return res.status(400).send({ error: e.message });
  }

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


router.post("/api/opportunities", (req, res) => {
  // commented out for now...
  // create dailySchedule objects for each weekday based on input, storing hour of interval
  // const dailySchedules = req.body.schedule.map(day => {
  //   if (day.includes('')){
  //     return({ available: false, hours: [] })
  //   } else {
  //     return({ available: true, hours: [{ start: parseInt(day[0]), end: parseInt(day[1]) }] })
  //   }
  // })
  // // create and populate a schedule (TODO: task#27) - open to feedback for how schedule should be passed/initialized
  // const schedule = {
  //   mon: dailySchedules[0],
  //   tues: dailySchedules[1],
  //   wed: dailySchedules[2],
  //   thurs: dailySchedules[3],
  //   fri: dailySchedules[4],
  //   sat: dailySchedules[5],
  //   sun: dailySchedules[6],
  // };

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
        schedule: null,
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

router.put("/api/opportunities/:id", async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send();
  }
  const id = new ObjectID(req.params.id);

  const userEmail = req.session.user;
  try {
    const foundUser = User.findOne({ email: userEmail })
    if (!foundUser) {
      return res.status(404).send();
    }

    const opportunity = await Opportunity.findById(id);
    if (!opportunity) {
      return res.status(404).send();
    }
    // update opportunity only if it is created by current user
    // or it is an admin user
    if (foundUser.userType == "HOST" && opportunity.poster != foundUser._id) {
      return res.status(403).send();
    }
    const Model = getModel(req.body.workType || opportunity.workType);
    Model.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true },
      (err, result) => {
        if (err || !result) {
          res.status(400).send({ error: err || "Failed to update opportunity." });
        } else {
          res.send({ response: result });
        }
      }
    );


  } catch (error) {
    return res.status(400).send({ error });
  }
});

router.delete("/api/opportunities/:id", async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send();
  }
  const id = new ObjectID(req.params.id);

  const userEmail = req.session.user;
  try {
    const foundUser = User.findOne({ email: userEmail })
    if (!foundUser) {
      return res.status(404).send();
    }

    const opportunity = await Opportunity.findById(id);
    if (!opportunity) {
      return res.status(404).send();
    }
    // delete opportunity only if it is created by current user
    // or it is an admin user
    if (foundUser.userType == "HOST" && opportunity.poster != foundUser._id) {
      return res.status(403).send();
    }
    await opportunity.remove();
    return res.send({ response: opportunity });

  } catch (error) {
    return res.status(400).send({ error });
  }
});

// export the router
module.exports = router;
