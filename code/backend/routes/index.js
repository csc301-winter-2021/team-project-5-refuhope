/* Main server for API functionality */
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");

// import our mongoose connection
const mongoose = require("../db/mongoose");

// express setup
const port = process.env.PORT || 5000;
const app = express();

// create application/json parser (same functionality as body-parser.json)
app.use(express.json());
app.use(cookieParser());

// initialize express session with cookies
app.use(
  session({
    key:"userId", 
    secret: "secretkey", // change this as needed
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 6000000,
      httpOnly: true,
      secure: true,
    },
  })
);

/* API routes */
// refugee routes
app.use(require("./refugee.routes"));

// user routes
app.use(require("./user.routes"));

// volunteer opportunity routes
app.use(require("./opportunity.routes"));

// UI routes
app.use(
  express.static(
    path.join(path.resolve(__dirname, "../.."), "./frontend/build")
  )
);
app.get("*", (req, res) => {
  res.sendFile(
    path.join(path.resolve(__dirname, "../.."), "./frontend/build/index.html")
  );
});

// listen for requests
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
