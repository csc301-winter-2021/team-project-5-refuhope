const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const { ObjectID } = require("mongodb");
const { User } = require("../models/user");

// get host user by id
router.get("/api/userByID/:id", (req, res) => {
  const id = req.params.id;
  // check if id is valid
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  // find host user with unique ID and send bad request or not found on failure
  User.findById(id)
    .then((foundUser) => {
      if (!foundUser) {
        res.status(404).send();
      } else {
        res.send({ response: foundUser });
      }
    })
    .catch((error) => {
      res.status(400).send({ error });
    });
});

// get registered user with email if it exists
router.get("/api/userSearch/:email", (req, res) => {
  const searchedEmail = req.params.email;
  // find the user that the given email identifies
  User.findOne({ email: searchedEmail }).then(
    (foundUser) => {
      res.send({ response: foundUser });
    },
    (error) => {
      res.status(400).send({ error });
    }
  );
});

// get all registered users in the system - mostly good for debugging
router.get("/api/userSearch", (req, res) => {
  // find all users registered in db and send bad request on failure
  User.find().then(
    (allUsers) => {
      res.send({ response: allUsers });
    },
    (error) => {
      res.status(400).send({ error });
    }
  );
});

// get logged in user (this might be useful for calling in frontend when app is reloaded but session/cookie persists)
router.get("/api/loggedInUser", (req, res) => {
  const userEmail = req.session.user;
  // find the user that the given user email identifies
  User.findOne({ email: userEmail }).then(
    (foundUser) => {
      res.send({ foundUser });
    },
    (error) => {
      res.status(400).send({ error });
    }
  );
});

// verify login for user given email + password
router.post("/api/login", (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  // authentication based on credentials
  User.findOne({ email: userEmail }).then(
    (foundUser) => {
      // 401 error on failed login verification
      if (!foundUser) {
        res.status(401).send();
      } else {
        // if there is a user matching email compare hashed passwords
        bcrypt.compare(userPassword, foundUser.password, (error, result) => {
          if (result) {
            // update session
            req.session.user = foundUser.email;
            res.send({ response: foundUser });
          } else {
            res.status(401).send({ error });
          }
        });
      }
    },
    (error) => {
      res.status(400).send({ error });
    }
  );
});

// destroy session on logout
router.post("/api/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.status(500).send({ error });
    } else {
      res.sendStatus(200);
    }
  });
});

// add a new user to db
router.post("/api/userAdd", (req, res) => {
  // create a new user (default to host user)
  const newUser = new User({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    userType: "HOST",
  });

  // encrypt new user password with bcrypt + salt
  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (error, hash) => {
      if (error) {
        res.status(400).send({ error });
      }
      newUser.password = hash;
      // save new user to database
      newUser.save().then(
        (result) => {
          // consider updating session with user here (if new user should be directed to home page straight after registration)
          res.send({ response: result });
        },
        (error) => {
          // 400 for bad request
          res.status(400).send({ error });
        }
      );
    });
  });
});

// delete user by email (might be useful)
router.delete("/api/userDelete/:email", (req, res) => {
  const userEmail = req.params.email;
  // find and delete user associated to specified email
  User.findOneAndDelete({ email: userEmail }).then(
    (deletedUser) => {
      res.send({ response: deletedUser });
    },
    (error) => {
      res.status(400).send({ error });
    }
  );
});

// export the router
module.exports = router;
