const request = require("supertest");
const express = require("express");
const mongoose = require('mongoose')

const { Opportunity } = require("../models/opportunity");
const routes = require('../routes/opportunity.routes')

const app = express();
app.use(express.json())
app.use(routes)

beforeAll(async () => {
    const dbURL = process.env.MONGODB_URI || 'mongodb://localhost:27017/RefuTalent_Test';
    await mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true})
})

afterAll(async () => {
    await mongoose.connection.close();
})


// router.post("/api/opportunityAdd"
it('When POST opportunityAdd should add new opportunity and status 200', async done => {
    const res = await request(app).post('/api/opportunityAdd')
        .send({
            title: "title",
            additionalInfo: "additionalInfo",
            city: "city",
            province: "province",
            workType: "TUTORING",
            numWorkHours: 1,
        })
    expect(res.statusCode).toBe(200);
    
    const op = await Opportunity.findOne({title: "title"})
    expect(op.description).toBeTruthy()

    done();
})

// router.get("/api/opportunityByPoster/:poster"
// JSON.parse(res.text).response._id
it('When GET opportunityByPoster should return opportunity and status 200', async done => {
    const check = await Opportunity.findOne({title: "title"})
    expect(check.additionalInfo).toBeTruthy()

    const res = await request(app).get('/api/opportunityByPoster/'+check._id)
    expect(res.statusCode).toBe(200);
    
    const op = await Opportunity.findOne({_id: check._id})
    expect(op.additionalInfo).toBeTruthy()

    done();
})

// router.get("/api/opportunityByRefugee/:refugee"

// get all opportunities
// router.get("/api/opportunitySearch"
it('When GET opportunitySearch should return List and status 200', async done => {
    const res = await request(app).get('/api/opportunitySearch');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).response instanceof Array).toBe(true);
    

    Opportunity.findOneAndDelete({ title: "title" })
    done();
})
