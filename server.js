const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");

const app = express();

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Use this after the variable declaration

//BodyParser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());

//DB Configuration
const db = require("./config/keys").mongoURI;

//Connect to MongoDB database
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

//Passport middleware
app.use(passport.initialize());

//Passport config
require("./config/passport");

//Routes
app.use("/api/users", users);

// const port = process.env.PORT || 5000;

const port = 5000;

app.listen(port, () => console.log(`Server up and running on ${port}!`));
