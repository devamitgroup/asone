const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Account = mongoose.model("Account", accountSchema);
module.exports = Account;
