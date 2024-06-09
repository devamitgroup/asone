const express = require("express");
const router = express.Router();
const introController = require("../controllers/InfoController");
const upload = require("../config/multer");

router.get("/admin", introController.getIntroduction);

router.get("/", introController.getIntroductionClient, (req, res) => {
  res.render("client/gioi-thieu.ejs", {
    intro: res.locals.intro,
    faviconPath: process.env.FAVICON_PATH,
    BASE_URL: process.env.BASE_URL,
  });
});

router.post(
  "/create",
  upload.single("avt"),
  introController.createIntroduction
);
router.put("/update", upload.single("avt"), introController.updateIntroduction);

module.exports = router;
