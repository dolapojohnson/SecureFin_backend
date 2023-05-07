const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const registerSchema = new Schema({
     userName: {
          type: String,
          required: true
     },
     fullName: {
          type: String,
          required: true
     },
     email: {
          type: String,
          required: true
     },
     accountNumber: {
          type: String,
          required: true
     },
     address: {
          type: String,
          required: true
     },
     phoneNumber: {
          type: String,
          required: true
     },
     bvn: {
          type: String,
          required: true
     },
     nin: {
          type: String,
          required: true
     },
     password: {
          type: String,
          required: true
     },
     date: {
          type: Date,
          default: Date.now
     }
})

module.exports = Register = mongoose.model("registers", registerSchema);