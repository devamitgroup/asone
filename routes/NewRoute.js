const express = require("express");
const router = express.Router();
const newController = require("../controllers/NewController");
const upload = require("../config/multer");

router.get("/", (req, res) => {
  res.render("client/tin-tuc/page/index.ejs", {
    title: "Tin tức",
    faviconPath: process.env.FAVICON_PATH,
    baseUrl: process.env.BASE_URL,
  });
});

router.get("/admin", (req, res) =>
  res.render("admin/news.ejs", {
    title: "Quản lý tin tức",
    faviconPath: process.env.FAVICON_PATH,
  })
);

router.get("/them-tin-tuc", (req, res) =>
  res.render("admin/add-new.ejs", {
    title: "Thêm tin tức",
    faviconPath: process.env.FAVICON_PATH,
  })
);

router.get("/admin/:slug", newController.getNewsBySlug, (req, res) => {
  if (res.locals.news) {
    res.render("admin/edit-new.ejs", {
      faviconPath: process.env.FAVICON_PATH,
      baseUrl: process.env.BASE_URL,
      title: res.locals.news.name,
      news: res.locals.news, // Sử dụng dữ liệu sản phẩm lấy được từ controller
    });
  } else {
    res.status(404).render("error.ejs", { message: "Product not found" });
  }
});

router.get("/get-tin-tuc", newController.getNews);

router.post("/create", upload.single("avt"), newController.createNews);

router.put("/update/:id", upload.single("avt"), newController.updateNews);
router.get("/get-random-news", newController.getRandomNews);
router.delete("/delete/:id", newController.deleteNews);
router.get("/:slug", newController.getNewsBySlug, (req, res) => {
  if (res.locals.news) {
    res.render("client/chi-tiet-tin-tuc.ejs", {
      faviconPath: process.env.FAVICON_PATH,
      baseUrl: process.env.BASE_URL,
      title: res.locals.news.name,
      news: res.locals.news, // Sử dụng dữ liệu sản phẩm lấy được từ controller
    });
  } else {
    res.status(404).render("error.ejs", { message: "Product not found" });
  }
});

module.exports = router;
