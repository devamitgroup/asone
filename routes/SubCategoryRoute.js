const express = require("express");
const router = express.Router();
const subcategoryController = require("../controllers/SubCategoryController");

// Route để tạo Subcategory mới
router.post("/add", subcategoryController.createSubcategory);

router.get("/:slug", subcategoryController.getSubcategoryBySlug, (req, res) => {
  res.render("client/chi-tiet-danh-muc-con/page/index.ejs", {
    subcategoryId: res.locals.subcategory._id,
    title: res.locals.subcategory.name,
    BASE_URL: process.env.BASE_URL,
    faviconPath: process.env.FAVICON_PATH_CLIENT,
  });
});
router.get(
  "/parent/:parentCategoryId",
  subcategoryController.getSubcategoriesByParentCategory
);
// Route để sửa Subcategory
router.put("/edit/:id", subcategoryController.updateSubcategory);

// Route để xóa Subcategory
router.delete("/:id", subcategoryController.deleteSubcategory);

// Route để lấy danh sách Subcategory theo parentCategory

router.get(
  "/get/:parentCategoryId",
  subcategoryController.getSubcategoriesByParentCategoryClient,
  (req, res) => {
    if (res.locals.subcategories) {
      res.status(200).json(res.locals.subcategories);
    } else {
      res
        .status(404)
        .json({ message: "No subcategories found for this parent category." });
    }
  }
);

// Route để lấy chi tiết của một Subcategory
router.get("/subcategory/:id", subcategoryController.getSubcategoryById);

router.get("/", subcategoryController.listSubcategoryUser);

module.exports = router;
