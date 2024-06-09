const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/CategoryController");
const upload = require("../config/multer");
router.get("/all", categoryController.getAllCategories);

router.get("/admin", categoryController.getCategoriesWithPagination);
router.get("/:slug", categoryController.getCategoryBySlug, (req, res) => {
  res.render("client/chi-tiet-danh-muc/page/index.ejs", {
    title: res.locals.category.name,
    categoryId: res.locals.category._id,
    BASE_URL: process.env.BASE_URL,
    faviconPath: process.env.FAVICON_PATH_CLIENT,
  });
});
router.post("/add", upload.single("avt"), categoryController.createCategory);

router.put(
  "/edit/:id",
  upload.single("avt"),
  categoryController.updateCategory
);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
