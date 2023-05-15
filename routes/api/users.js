const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const Joi = require('joi');
const sanitizeHtml = require('sanitize-html');

//Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

//Load Register and User model
const Register = require("../../models/Register");
const User = require("../../models/User");

const loginSchema = Joi.object({
     email: Joi.string().required(),
     password: Joi.string().required()
})

// Sanitization options for sanitize-html library
const sanitizeOptions = {
     allowedTags: [],
     allowedAttributes: {}
};

// .@route GET api/users/allusers
// .@desc Allusers user
// .@access Public
router.get("/users", (req, res) => {
     User.find().then((err, data) => {
          if (err) {
               res.json(err)
          } else {
               res.json(data)
          }
     })
})


// .@route POST api/users/register
// .@desc Register account
// .@access Public
router.post("/register", (req, res) => {
     
//Form validation
const { errors, isValid } = validateRegisterInput(req.body);

// Check validation
     // if (!isValid) {
     //      return res.status(400).json(errors);
     // }

Register.findOne({ email: req.body.email })
.then(user => {
     if (user) {
          return res.status(400).json({ email: "Email already exists"});
     } else {
          const newUser = new User({
               userName: req.body.userName,
               fullName: req.body.fullName,
               email: req.body.email,
               accountNumber: req.body.accountNumber,
               address: req.body.address,
               phoneNumber: req.body.phoneNumber,
               bvn: req.body.bvn,
               nin: req.body.nin,
               password: req.body.password,
          });

     //Hash password before saving in database
          bcrypt.genSalt(10, (err, salt) => {
               bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
               });
          });
     }
   });
});



// .@route POST api/users/login
// .@desc Login user and return JWT token
// .@access Public
router.post("/login", (req, res) => {
// Check validation
     // if (!isValid) {
     //      return res.status(400).json(errors);
     // }

       // Validate and sanitize the request body
     const { error, value } = loginSchema.validate(req.body);

     if (error) {
     // Handle validation errors
     return res.status(400).json({ error: error.details[0].message });
     }

     // Access the sanitized values
     const sanitizedUsername = sanitizeHtml(value.email, sanitizeOptions);
     const sanitizedPassword = sanitizeHtml(value.password, sanitizeOptions);

     const email = req.body.email;
     const password = req.body.password;

     // Find user by email
     User.findOne({email})
     .then(user => {
          //Check if user exists
          if (!user) {
               return res.status(400).json({ emailnotfound: "Email not found"});
          }

          //Check password
          bcrypt.compare(password, user.password).then(isMatch => {
               if (isMatch) {
               //User matched
               //Create JWT Payload
                    const payload = {
                         id: user.id,
                         name: user.name
                    };
               //Sign Token
               jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                         expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                         res.json({
                              success: true,
                              token: "Bearer " + token,
                              payload
                         });
                    }
               );
               } else {
                    return res.status(400)
                    .json({ passwordincorrect: "Password incorrect" });
               }
          });
     });
});



// .@route POST api/users/signup
// .@desc User signup
// .@access Public
router.post("/signup", (req, res) => {
     
     //Form validation
     // const { errors, isValid } = validateRegisterInput(req.body);
     
     // Check validation
          // if (!isValid) {
          //      return res.status(400).json(errors);
          // }
     
     User.findOne({ email: req.body.email })
     .then(user => {
          if (user) {
               return res.status(400).json({ email: "Email already exists"});
          } else {
               const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
               });
     
          //Hash password before saving in database
               bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                         if (err) throw err;
                         newUser.password = hash;
                         newUser.save()
                         .then(user => res.json(user))
                         .catch(err => console.log(err));
                    });
               });
          }
        });
     });

module.exports = router;