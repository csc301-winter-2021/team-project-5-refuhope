const constructScheduleQuery = (schedule) => {
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
  return scheduleOverlapQuery
}

module.exports = { constructScheduleQuery };
