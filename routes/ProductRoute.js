const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../config/multer");

router.get("/", productController.listProducts);
router.get("/tat-ca-san-pham", (req, res) => {
  res.render("client/tat-ca-san-pham/page/index.ejs", {
    title: "Tất cả sản phẩm",
    BASE_URL: process.env.BASE_URL,
    faviconPath: process.env.FAVICON_PATH_CLIENT,
  });
});

router.post(
  "/add",
  upload.array("images", 10),
  productController.createProduct
);

router.get("/them-san-pham", (req, res) => {
  res.render("admin/them-san-pham.ejs", { title: "Thêm sản phẩm" });
});
router.get("/bestsell", productController.getBestSellingProducts);
router.get("/admin", (req, res) => {
  res.render("admin/product.ejs", { title: "Quản lý sản phẩm" });
});

router.get("/admin/:slug", productController.getProductBySlug, (req, res) => {
  if (res.locals.product) {
    res.render("admin/updateproduct.ejs", {
      title: res.locals.product.name,
      product: res.locals.product, // Sử dụng dữ liệu sản phẩm lấy được từ controller
    });
  } else {
    res.status(404).render("error.ejs", { message: "Product not found" });
  }
});

router.get("/tim-kiem", productController.searchProductsByKeyword);
router.get("/ket-qua-tim-kiem", (req, res) => {
  res.render("client/tim-kiem/index.ejs", {
    title: "Kết quả tìm kiếm",
    BASE_URL: process.env.BASE_URL,
    faviconPath: process.env.FAVICON_PATH_CLIENT,
  });
});
router.get("/:slug", productController.getProductBySlug, (req, res) => {
  if (res.locals.product) {
    res.render("client/chi-tiet-san-pham.ejs", {
      title: res.locals.product.name,
      product: res.locals.product,
      BASE_URL: process.env.BASE_URL,
      faviconPath: process.env.FAVICON_PATH_CLIENT,
    });
  } else {
    res.status(404).render("error.ejs", { message: "Product not found" });
  }
});

router.put(
  "/edit/:id",
  upload.array("images"),
  productController.updateProduct
);

router.delete("/delete/:id", productController.deleteProduct);

router.get(
  "/get-by-parent-category/:parentCategoryId",
  productController.getProductsByParentCategory
);
router.get(
  "/get-by-category/:categoryId",
  productController.getProductsByCategoryChildId
);

router.get(
  "/get-product-recoment/:categoryId",
  productController.getProductsByCategoryId
);
module.exports = router;
