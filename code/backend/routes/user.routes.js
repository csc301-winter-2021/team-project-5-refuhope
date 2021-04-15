const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const { ObjectID } = require("mongodb");
const { User } = require("../models/user");

// get host user by id
router.get("/api/users/:id", (req, res) => {
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

// get all registered users in the system - mostly good for debugging
router.get("/api/users", (req, res) => {
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
router.get("/api/loggedIn", (req, res) => {
  const userEmail = req.session.user;
  // find the user that the given user email identifies
  User.findOne({ email: userEmail }).then(
    (foundUser) => {
      res.send({ loggedIn: foundUser });
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
router.post("/api/users", (req, res) => {
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

// update user password for currently logged in user
router.put("/api/changePassword", (req, res) => {
  const userEmail = req.session.user;
  const newPassword = req.body.password;
  const saltRounds = 10;
  // re-encrypt new user password
  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(newPassword, salt, (error, hash) => {
      if (error) {
        res.status(400).send({ error });
      }
      const newPassword = hash;

      // update user associated with email with new info
      User.findOneAndUpdate(
        { email: userEmail },
        { $set: { password: newPassword } },
        { new: true, runValidators: true },
        (err, result) => {
          if (err) {
            res.status(400).send({ error: err });
          } else {
            res.send({ response: result });
          }
        }
      );
    });
  });
});

// update user information for currently logged in user (not including password)
router.put("/api/users/:email?", async (req, res) => {
  // if an email is provided in req body use that otherwise update current user in session
  const userEmail = req.session.user;
  const paramEmail = req.params.email;
  const newUserInfo = req.body;
  // ensure that password is not included in request
  delete newUserInfo.password;

  // if an email is provided this indicates that a requested update for this particular user
  if (paramEmail) {
    const curUser = await User.findOne({ email: userEmail });
    if (!curUser || curUser.userType == "HOST") {
      return res.status(403).send({ error: "Unauthorized access by a non-admin user" });
    }
    // if cur user is an admin update requested user
    User.findOneAndUpdate(
      { email: paramEmail },
      { $set: newUserInfo },
      { new: true, runValidators: true },
      (err, result) => {
        if (err) {
          res.status(400).send({ error: err });
        } else {
          res.send({ response: result });
        }
      }
    );
  } else {
    // otherwise update user in current session
    User.findOneAndUpdate(
      { email: userEmail },
      { $set: newUserInfo },
      { new: true, runValidators: true },
      (err, result) => {
        if (err) {
          res.status(400).send({ error: err });
        } else {
          res.send({ response: result });
        }
      }
    );
  }
});

// delete user by id (for admins)
router.delete("/api/users/:id", async (req, res) => {
  const userId = req.params.id;
  if (!ObjectID.isValid(userId) || !req.session.user) {
    return res.status(404).send();
  }

  // check if current user is admin
  const userEmail = req.session.user;
  const curUser = await User.findOne({ email: userEmail });
  if (!curUser || curUser.userType == "HOST") {
    return res.status(403).send({ error: "Unauthorized access by a non-admin user" });
  }

  // delete user from db
  User.findByIdAndDelete(userId).then(
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
