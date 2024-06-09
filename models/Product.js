const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		images: [
			{
				type: String,
				required: false,
			},
		],
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Subcategory",
		},
		manufacturer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Manufacturer",
		},
		slug: {
			type: String,
			required: true,
			unique: true,
		},
		model: {
			type: String,
		},
		idProduct: {
			type: String,
		},
		detailProduct: {
			type: String,
		},
		describe: {
			type: String,
		},
		bestSelling: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
