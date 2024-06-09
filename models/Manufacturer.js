const mongoose = require("mongoose");

const manufacturerSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const Manufacturer = mongoose.model("Manufacturer", manufacturerSchema);

module.exports = Manufacturer;
