const express = require("express");
const router = express.Router();

router.get("/admin", (req, res) => {
  res.render("admin/index.ejs", { title: "Đăng nhập quản trị" });
});

router.get("/admin/home", (req, res) => {
  res.render("admin/home.ejs", { title: "Quản trị" });
});

router.get("/", (req, res) => {
  res.render("client/index.ejs", {
    title: "Đại Lý AS ONE Việt Nam",
    BASE_URL: process.env.BASE_URL,
    faviconPath: process.env.FAVICON_PATH_CLIENT,
  });
});

module.exports = router;
