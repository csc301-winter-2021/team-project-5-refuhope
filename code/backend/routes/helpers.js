const { ObjectID } = require("mongodb");

const constructScheduleQuery = (schedule) => {
  scheduleOverlapQuery = []
  schedMongoQuery = schedule.split(";").forEach((daySched) => {
    const ind = daySched.indexOf(":")
    const day = daySched.substring(0, ind);
    daySched.substring(ind+1).split(",").forEach((interval) => {
      const startTime = interval.split("-")[0];
      const endTime = interval.split("-")[1];
      const startHour = Number.parseInt(startTime.split(".")[0]);
      const startMinute = Number.parseInt(startTime.split(".")[1]);
      const endHour = Number.parseInt(endTime.split(".")[0]);
      const endMinute = Number.parseInt(endTime.split(".")[1]);

      scheduleOverlapQuery.push({ $and: [
        {$or: [
          {[`schedule.${day}.startHour`]: {$lt: endHour}},
          {$and: [
            {[`schedule.${day}.startHour`]: {$eq: endHour}},
            {[`schedule.${day}.startMinute`]: {$lt: endMinute}},
          ]},
        ]},
        {$or: [
          {[`schedule.${day}.endHour`]: {$gt: startHour}},
          {$and: [
            {[`schedule.${day}.endHour`]: {$eq: startHour}},
            {[`schedule.${day}.endMinute`]: {$gt: startMinute}}
          ]},
        ]}
      ]});
    });
  });

  return scheduleOverlapQuery
}

const processId = (key, value, queryObj) => {
  if (value) {
    if (!ObjectID.isValid(value)) {
      throw new Error(`Invalid ID for ${key} field.`);
    }
    queryObj[key] = new ObjectID(value);
  }
}

module.exports = { constructScheduleQuery, processId };
