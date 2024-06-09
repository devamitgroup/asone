const mongoose = require("mongoose");

const infoSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

const Info = mongoose.model("Info", infoSchema);

module.exports = Info;
