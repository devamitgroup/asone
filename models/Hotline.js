const mongoose = require("mongoose");

const hotlineSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const Hotline = mongoose.model("Hotline", hotlineSchema);

module.exports = Hotline;
