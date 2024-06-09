const mongoose = require("mongoose");

const newSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    avt: {
      type: String,
      required: true,
    },
    describe: String,
    detail: String,
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const New = mongoose.model("New", newSchema);
module.exports = New;
