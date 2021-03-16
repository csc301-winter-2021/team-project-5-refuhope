const request = require("supertest");
const express = require("express");
const mongoose = require('mongoose')
var bodyParser = require('body-parser');

const { Refugee } = require("../models/refugee");

const routes = require('../routes/refugee.routes')

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(routes)

beforeAll(async () => {
    const dbURL = process.env.MONGODB_URI || 'mongodb://localhost:27017/RefuTalent_Test';
    await mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true})
})

afterAll(async () => {
    await mongoose.connection.close();
})

// add a new refugee to db 
//router.post("/api/refugeeAdd")
it('When POST refugeeAdd should add new refugee and status 200', async done => {
    const res = await request(app).post('/api/refugeeAdd')
        .send({
            name: "name", 
            phone: "123", 
            email: "emails@email.com"
        })
    // console.log(res)
    expect(res.statusCode).toBe(200);
    
    const refugee = await Refugee.findOne({email: "emails@email.com"})
    expect(refugee.email).toBeTruthy()

    done();
})

// get all registered refugees
//router.get("/api/refugeeSearch"
it('When GET refugeeSearch should return Array and status 200', async done => {
    const res = await request(app).get('/api/refugeeSearch');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).response instanceof Array).toBe(true);
    
    done();
})

// // get refugee with specified name in search
// //router.get("/api/refugeeSearch/:name"
it('When GET refugeeSearch/:name should return refugee and status 200', async done => {
    const res = await request(app).get('/api/refugeeSearch/name');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).response.name).toBe("name");

    Refugee.findOneAndDelete({ email: "emails@email.com" })

    done();
})