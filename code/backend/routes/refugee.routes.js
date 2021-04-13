const express = require("express");
const router = express.Router();

const { ObjectID } = require("mongodb");
const { Refugee } = require("../models/refugee");
// const { Opportunity } = require("../models/opportunity");
const { constructScheduleQuery, processId } = require("./helpers");

// get refugee by id
router.get("/api/refugees/:id", (req, res) => {
  const id = req.params.id;
  // check if id is valid
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  // find refugee with unique ID and send bad request or not found on failure
  Refugee.findById(id)
    .then((foundRefugee) => {
      if (!foundRefugee) {
        res.status(404).send();
      } else {
        res.send({ response: foundRefugee });
      }
    })
    .catch((error) => {
      res.status(400).send({ error });
    });
});

// get all registered refugees (useful for refugee dashboard page)
router.get("/api/refugees", (req, res) => {
  // find all refugees registered in db and send bad request on failure
  const { schedule } = req.query;
  const filterQuery = req.query;
  delete filterQuery.schedule;

  try {
    processId("_id", filterQuery._id, filterQuery);
  } catch (e) {
    return res.status(400).send({ error: e.message });
  }

  if (schedule) {
    filterQuery.$or = constructScheduleQuery(schedule);
  }
  Refugee.find({ ...filterQuery }).then(
    (allRefugees) => {
      res.send({ response: allRefugees });
    },
    (error) => {
      res.status(400).send({ error });
    }
  );
});

router.get("/api/refugees/matches", async (req, res) => {
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
          from: "opportunities",
          localField: "_id",
          foreignField: "matchedRefugee",
          as: "opportunity",
        },
      },
      { $unwind: "$opportunity" },
      { $match: { ["opportunity._id"]: new ObjectID(match) } },
      { $unset: "opportunity" },
    ]);
  } else {
    matchedRefugees = await Refugee.aggregate([
      {
        $lookup: {
          from: "opportunities",
          localField: "_id",
          foreignField: "matchedRefugee",
          as: "opportunity",
        },
      },
      { $match: { opportunity: { $size: 0 } } },
      { $unset: "opportunity" },
    ]);
  }

  res.send({ response: matchedRefugees });
});

// add a new refugee to db
router.post("/api/refugees", (req, res) => {

  // create a new refugee assuming req follows schema
  const newRefugee = new Refugee({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    city: req.body.city,
    province: req.body.prov,
    additionalInfo: req.body.additionalInfo,
    workType: req.body.workType,
    schedule: null,
    numWorkHours: req.body.numWorkHours,
  });
  // save new refugee to DB
  newRefugee.save().then(
    (result) => {
      // save and send object that was saved
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
