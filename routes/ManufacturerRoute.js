const express = require("express");
const router = express.Router();
const manufacturerController = require("../controllers/ManufacturerController");

router.get("/admin", manufacturerController.listManufacturers);

router.get("/", manufacturerController.listManufacturersUser);

router.post("/add", manufacturerController.createManufacturer);

router.delete("/:id", manufacturerController.deleteManufacturer);

router.get("/:id", manufacturerController.readManufacturer);

router.put("/edit/:id", manufacturerController.updateManufacturer);

module.exports = router;
