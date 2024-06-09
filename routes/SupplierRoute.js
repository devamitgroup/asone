const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/SupplierController");
const upload = require("../config/multer");

router.get("/admin", (req, res) => {
  res.render("admin/nha-cung-cap.ejs", {
    title: "Nhà cung cấp",
    BASE_URL: process.env.BASE_URL,
    faviconPath: process.env.FAVICON_PATH,
  });
});

router.get("/admin/:slug", supplierController.getSupplierBySlug, (req, res) => {
  if (res.locals.supplier) {
    res.render("admin/detail-nha-cung-cap.ejs", {
      title: res.locals.supplier.name,
      supplier: res.locals.supplier,
      BASE_URL: process.env.BASE_URL,
      faviconPath: process.env.FAVICON_PATH,
    });
  } else {
    res.status(404).render("error.ejs", { message: "Supplier not found" });
  }
});

router.get("/all", supplierController.getAllSuppliers);

router.post("/add", upload.single("avt"), supplierController.addSupplier);
router.put(
  "/update/:id",
  upload.single("avt"),
  supplierController.updateSupplier
);
router.delete("/delete/:id", supplierController.deleteSupplier);
router.get("/:slug", supplierController.getSupplierBySlug, (req, res) => {
  if (res.locals.supplier) {
    res.render("client/chi-tiet-nha-cung-cap.ejs", {
      title: res.locals.supplier.name,
      supplier: res.locals.supplier,
      BASE_URL: process.env.BASE_URL,
      faviconPath: process.env.FAVICON_PATH,
    });
  } else {
    res.status(404).render("error.ejs", { message: "Supplier not found" });
  }
});
module.exports = router;
