const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

//Load Register and User model
const User = require("../../models/User");
const { detectXML, detectHTML, detectScript } = require("../../utilities");

// .@route GET api/users/allusers
// .@desc Allusers user
// .@access Public
router.get("/allusers", (req, res) => {
  User.find().then((err, data) => {
    if (err) {
      res.json(err);
    } else {
      res.json(data);
    }
  });
});

// .@route POST api/users/login
// .@desc Login user and return JWT token
// .@access Public
router.post("/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(401).json({
      message: "Incomplete payload",
    });
  }

  //   --- perform detection here ----
  if (detectXML(email) || detectXML(email)) {
    return res.status(401).json({
      message: "XML code detected.",
    });
  } else if (detectHTML(email) || detectHTML(password)) {
    return res.status(401).json({
      message: "HTML elements detected",
    });
  } else if (detectScript(email) || detectScript(password)) {
    return res.status(401).json({
      message: "An unexpected script detected",
    });
  }

  // Find user by email
  User.findOne({ email }).then((user) => {
    //Check if user exists
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }

    //Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        //User matched
        //Create JWT Payload
        const payload = {
          id: user.id,
          name: user.userName,
        };
        //Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            return res.status(200).json({
              token: "Bearer " + token,
              message: "Success",
            });
          }
        );
      } else {
        return res.status(400).json({ message: "Login info incorrect" });
      }
    });
  });
});

// .@route POST api/users/signup
// .@desc User signup
// .@access Public
router.post("/signup", (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(401).json({
      message: "Incomplete payload",
    });
  }

  //   --- perform detection here ----
  if (detectXML(email) || detectXML(password) || detectXML(name)) {
    return res.status(401).json({
      message: "XML code detected.",
    });
  } else if (detectHTML(email) || detectHTML(password) || detectHTML(name)) {
    return res.status(401).json({
      message: "HTML elements detected",
    });
  } else if (
    detectScript(email) ||
    detectScript(password) ||
    detectScript(name)
  ) {
    return res.status(401).json({
      message: "An unexpected script detected",
    });
  }

  const newUser = new User({
    name,
    email,
    password,
  });

  //Hash password before saving in database
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser
        .save()
        .then((user) => {
          return res.status(200).json({
            message: "Successfully created",
            data: user,
          });
        })
        .catch((err) => {
          return res.status(401).json({
            message: "It seems this email has been used.",
          });
        });
    });
  });
});

module.exports = router;
