const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  avt: {
    type: String,
  },
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
