const express = require("express");
const app = express();
const connectDB = require("./config/database");
const bodyParser = require("body-parser");

// Set EJS as templating engine
app.set("view engine", "ejs");
connectDB();
require("dotenv").config();

// Static files
app.use("/public", express.static("public"));
app.use("/views", express.static("views"));
app.use("/public/uploads", express.static("public/uploads"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/", require("./routes/index"));
app.use("/danh-muc", require("./routes/Category"));
app.use("/danh-muc-con", require("./routes/SubCategoryRoute"));
app.use("/gioi-thieu", require("./routes/InfoRouter"));
app.use("/hang-san-xuat", require("./routes/ManufacturerRoute"));
app.use("/san-pham", require("./routes/ProductRoute"));
app.use("/tin-tuc", require("./routes/NewRoute"));
app.use("/account", require("./routes/AccountRoute"));
app.use("/nha-cung-cap", require("./routes/SupplierRoute"));
app.use("/khach-hang", require("./routes/ClientRoute"));
app.use("/lien-he", require("./routes/ContactRoute"));
app.use("/thuong-hieu", require("./routes/BrandRoute"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
