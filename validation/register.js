const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
     let errors = {};

//Convert empty fields to an empty string so we can use validator functions
     data.userName = !isEmpty(data.userName) ? data.userName : "";
     data.fullName = !isEmpty(data.fullName) ? data.fullName : "";
     data.email = !isEmpty(data.email) ? data.email : "";
     data.accountNumber = !isEmpty(data.accountNumber) ? data.accountNumber : "";
     data.address = !isEmpty(data.address) ? data.address : "";
     data.phoneNumber = !isEmpty(data.phoneNumber) ? data.phoneNumber : "";
     data.bvn = !isEmpty(data.bvn) ? data.bvn : "";
     data.nin = !isEmpty(data.nin) ? data.nin : "";
     data.password = !isEmpty(data.password) ? data.password : "";
     data.password2 = !isEmpty(data.password2) ? data.password2 : "";


// Name checks
     if (Validator.isEmpty(data.userName)) {
          errors.userName = "Username field is required";
     }

     //fullname
     if (Validator.isEmpty(data.fullName)) {
          errors.fullName = "Fullname field is required";
     }

// Email checks
     if (Validator.isEmpty(data.email)) {
          errors.email = "Email field is required";
     } else if (!Validator.isEmail(data.email)) {
          errors.email = "Email is invalid";
     }

// Account number checks
     if (Validator.isEmpty(data.accountNumber)) {
          errors.accountNumber = "Account Number field is required";
     }

// Address checks
     if (Validator.isEmpty(data.address)) {
          errors.address = "Address field is required";
     }

// Phone Number checks
     if (Validator.isEmpty(data.phoneNumber)) {
          errors.phoneNumber = "Phone Number field is required";
     }

// BVN checks
     if (Validator.isEmpty(data.bvn)) {
          errors.bvn = "BVN field is required";
     }

// NIN checks
     if (Validator.isEmpty(data.nin)) {
          errors.nin = "NIN field is required";
     }

// Password checks
     if (Validator.isEmpty(data.password)) {
          errors.password = "Password field is required";
     }
     if (Validator.isEmpty(data.password2)) {
          errors.password2 = "Confirm password field is required";
     }
     if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
          errors.password = "Password must be at least 6 characters";
     }
     if (!Validator.equals(data.password, data.password2)) {
          errors.password2 = "Passwords must match";
     }

     return {
          errors,
          isValid: isEmpty(errors)
     }
};