const express = require("express");
const router = express.Router();
const brandController = require("../controllers/BrandController");
const upload = require("../config/multer");
router.get("/", (req, res) => {
  res.render("client/thuong-hieu.ejs", {
    title: "Thương hiệu",
    BASE_URL: process.env.BASE_URL,
    faviconPath: process.env.FAVICON_PATH,
  });
});

router.get("/admin", brandController.getBrand, (req, res) => {
  res.render("admin/thuong-hieu.ejs", {
    title: "Thương hiệu",
    brands: res.locals.brands,
    BASE_URL: process.env.BASE_URL,
    faviconPath: process.env.FAVICON_PATH,
  });
});

router.get("/all", brandController.getBrand, (req, res) => {
  res.json(res.locals.brands);
});

router.get("/edit/:slug", brandController.getBrandSlug, (req, res) => {
  if (res.locals.brand) {
    res.render("admin/update-post-brand.ejs", {
      title: res.locals.brand.name,
      brand: res.locals.brand,
      BASE_URL: process.env.BASE_URL,
      faviconPath: process.env.FAVICON_PATH,
    });
  } else {
    res.status(404).render("error.ejs", { message: "Brand not found" });
  }
});

router.get("/create/add", (req, res) => {
  res.render("admin/add-post-brand.ejs", {
    title: "Tạo thương hiệu",
    BASE_URL: process.env.BASE_URL,
    faviconPath: process.env.FAVICON_PATH,
  });
});

router.get("/:slug", brandController.getBrandSlug, (req, res) => {
  if (res.locals.brand) {
    res.render("client/chi-tiet-thuong-hieu.ejs", {
      title: res.locals.brand.name,
      brand: res.locals.brand,
      BASE_URL: process.env.BASE_URL,
      faviconPath: process.env.FAVICON_PATH,
    });
  } else {
    res.status(404).render("error.ejs", { message: "Brand not found" });
  }
});

router.post("/create", upload.single("avt"), brandController.createBrand);
router.delete("/delete/:id", brandController.deleteBrand);
router.put("/update/:id", upload.single("avt"), brandController.updateBrand);
module.exports = router;
