const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  avt: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;
