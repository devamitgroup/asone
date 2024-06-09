const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		await mongoose.connect("mongodb://localhost:27017/data-as-one-vn", {});
		console.log("MongoDB connected successfully");
	} catch (err) {
		console.error("Failed to connect to MongoDB", err);
	}
};

module.exports = connectDB;
