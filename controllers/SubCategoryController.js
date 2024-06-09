const Subcategory = require("../models/SubCategory");

exports.listSubcategoryUser = async (req, res) => {
  try {
    const listSubcategory = await Subcategory.find();
    res.json(listSubcategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Thêm Subcategory mới
exports.createSubcategory = async (req, res) => {
  try {
    const { name, slug, parentCategory, describe } = req.body;
    const newSubcategory = new Subcategory({
      name,
      slug,
      parentCategory,
      describe,
    });
    const savedSubcategory = await newSubcategory.save();
    res.status(200).json({ message: "Thêm danh mục con thành công" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Sửa Subcategory
exports.updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, parentCategory, describe } = req.body;
    const updatedSubcategory = await Subcategory.findByIdAndUpdate(
      id,
      { name, slug, parentCategory, describe },
      { new: true }
    );
    res.status(200).json({ message: "Cập nhật thành công" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa Subcategory
exports.deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Subcategory.findByIdAndDelete(id);
    res.status(200).json({ message: "Danh mục con đã xóa thành côngs" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Lấy danh sách Subcategory theo parentCategory
exports.getSubcategoriesByParentCategory = async (req, res) => {
  try {
    const { parentCategoryId } = req.params;
    const subcategories = await Subcategory.find({
      parentCategory: parentCategoryId,
    });
    res.render("admin/danh-muc-con", {
      subcategories,
      parentId: parentCategoryId,
    });
    // res.status(200).json(subcategories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Lấy chi tiết của một Subcategory
exports.getSubcategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await Subcategory.findById(id);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res.status(200).json(subcategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getSubcategoryBySlug = async (req, res, next) => {
  try {
    const subcategory = await Subcategory.findOne({ slug: req.params.slug });
    if (!subcategory) {
      next();
      return;
    }
    res.locals.subcategory = subcategory;

    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getSubcategoriesByParentCategoryClient = async (req, res, next) => {
  try {
    const { parentCategoryId } = req.params;
    const subcategories = await Subcategory.find({
      parentCategory: parentCategoryId,
    });
    if (subcategories.length === 0) {
      return next();
    }
    res.locals.subcategories = subcategories;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
