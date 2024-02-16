/* eslint-disable no-shadow */
const { Schema, model } = require("mongoose");
const { hash, genSalt } = require("bcrypt");
const { validateEmail, validatePassword, validateName, } = require("../utils/validationUtils");

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: "Requires FirstName",
      trim: true,
      validate: { validator: validateName },
    },
    lastname: {
      type: String,
      required: "Requires LastName",
      trim: true,
      validate: { validator: validateName, message: "LastName Invalid" },
    },
    email: {
      type: String,
      required: "Requires Email",
      unique: true,
      lowercase: true,
      trim: true,
      validate: { validator: validateEmail, message: "Email Invalid" },
    },
    password: {
      type: String,
      required: "Requires Password",
    },
    isadmin: {
      type: Boolean,
      default: false,
    },
    scripts: [
      {
        type: Schema.Types.ObjectId,
        ref: "script",
      },
    ],
    subscription: {
      type: {
        type: String,
        enum: ["Yearly", "Monthly", "Hourly", "Days"],
      },
      startDate: {
        type: Date,
        default: Date.now,
      },
      expirationDate: {
        type: Date,
      },
    },
    status: {
      type: String,
      default: 'Active'
    }
  },
  { timestamps: true }
);

module.exports = model("user", userSchema);
