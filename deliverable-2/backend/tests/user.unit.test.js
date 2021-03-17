const request = require("supertest");
const express = require("express");
const mongoose = require('mongoose')

const routes = require('../routes/user.routes')

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

// get host user by id
// router.get("/api/userByID/:id"

// add a new user to db
// router.post("/api/userAdd"
it('When POST userAdd should add new user and status 200', async done => {
    const res = await request(app).post('/api/userAdd')
        .send({
            name: "name", 
            password: "123456", 
            email: "emails@email.com"
        })
    expect(res.statusCode).toBe(200);
    // expect(JSON.parse(res.text).response instanceof Array).toBe(true);
    done();
})

// verify login for user given email + password
// router.get("/api/login", (req, res)
it('When GET login should return user and status 200', async done => {
    const res = await request(app).get('/api/login?email=emails@email.com&password=123456')
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).response.email).toBe("emails@email.com");
    done();
})

// get registered user with email if it exists
// router.get("/api/userSearch/:email"
it('When GET userSearch should return user and status 200', async done => {
    const res = await request(app).get('/api/userSearch?email=emails@email.com')
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).response[0].email).toBe("emails@email.com");
    done();
})

// get all registered users in the system
// router.get("/api/userSearch
it('When GET userSearch should return Array and status 200', async done => {
    const res = await request(app).get('/api/userSearch');
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.text).response instanceof Array).toBe(true);
    done();
})

// delete user by email
// router.delete("/api/userDelete/:email"
it('When DELETE userDelete should delete user and status 200', async done => {
    const res = await request(app).delete('/api/userDelete/emails@email.com')
    expect(res.statusCode).toBe(200);

    done();
})
