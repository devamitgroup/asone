const Category = require("../models/Category"); // Đảm bảo đường dẫn đến file model Category đúng

// Lấy danh sách tất cả các danh mục
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      next();
      return;
    }
    res.locals.category = category;
    next();
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
// Tạo một danh mục mới
exports.createCategory = async (req, res) => {
  const { name, slug, describe } = req.body;
  const avt = req.file ? req.file.path : ""; // Lấy đường dẫn ảnh nếu có tải lên

  try {
    const newCategory = new Category({
      name,
      slug,
      avt, // Lưu đường dẫn ảnh
      describe,
    });

    await newCategory.save();
    res.status(200).json({ message: "Thêm danh mục thành công" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật thông tin danh mục
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = req.body.name;
    category.slug = req.body.slug;
    category.describe = req.body.describe;
    if (req.file) {
      category.avt = req.file.path; // Cập nhật đường dẫn ảnh mới nếu có
    }
    const updatedCategory = await category.save();
    res.status(200).json({ message: "Cập nhật danh mục thành công" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    // Sử dụng deleteOne với điều kiện là _id để đảm bảo chỉ xóa một document duy nhất
    const result = await Category.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Danh mục đã được xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCategoriesWithPagination = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1 nếu không có truy vấn
  const limit = parseInt(req.query.limit) || 8; // Số lượng mục trên mỗi trang, mặc định là 10 nếu không có truy vấn

  try {
    const totalCount = await Category.countDocuments(); // Tổng số lượng danh mục
    const totalPages = Math.ceil(totalCount / limit); // Tổng số trang
    const offset = (page - 1) * limit; // Vị trí bắt đầu của trang hiện tại

    // Sắp xếp danh sách các danh mục theo thứ tự giảm dần của ngày tạo
    const categories = await Category.find()
      .sort({ createdAt: -1 }) // Sắp xếp theo thứ tự giảm dần của ngày tạo
      .skip(offset)
      .limit(limit);

    // Render trang EJS trong thư mục admin và truyền danh sách các danh mục, totalPages và currentPage vào
    res.render("admin/danh-muc", { categories, totalPages, currentPage: page });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
