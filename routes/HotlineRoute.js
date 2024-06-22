const express = require("express");
const router = express.Router();
const hotlineController = require("../controllers/HotlineController");

router.get("/", hotlineController.getIntroduction);

router.put("/", hotlineController.updateIntroduction);

router.post("/", hotlineController.createIntroduction);

router.get("/admin", (req, res) =>
  res.render("admin/thong-tin.ejs", {
    title: "Quản lý thông tin",
    faviconPath: process.env.FAVICON_PATH,
  })
);

module.exports = router;
