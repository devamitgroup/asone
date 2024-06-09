const New = require("../models/New");

// Get all news
exports.getNews = async (req, res) => {
  try {
    const news = await New.find();
    res.status(200).json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a news by slug
exports.getNewsBySlug = async (req, res, next) => {
  try {
    const news = await New.findOne({ slug: req.params.slug });
    if (!news) {
      next(); // Chuyển sang middleware tiếp theo, có thể là hiển thị trang lỗi
      return;
    }
    res.locals.news = news; // Lưu sản phẩm vào res.locals
    next(); // Gọi middleware tiếp theo (trong trường hợp này là function trong router)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a news
exports.createNews = async (req, res) => {
  try {
    const { name, describe, detail, slug } = req.body;
    const avt = req.file.path;
    const exists = await New.findOne({ slug });
    if (exists) {
      return res
        .status(400)
        .json({ message: "News already exists", success: false });
    }
    const newNews = new New({
      name,
      avt,
      describe,
      detail,
      slug,
    });
    await newNews.save();
    res
      .status(200)
      .json({ message: "Create news successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Update a news by id
exports.updateNews = async (req, res) => {
  try {
    const news = await New.findOne({ _id: req.params.id });
    if (!news) {
      return res
        .status(404)
        .json({ message: "News not found", success: false });
    }

    news.name = req.body.name || news.name;
    news.avt = req.file ? req.file.path : news.avt;
    news.describe = req.body.describe || news.describe;
    news.detail = req.body.detail || news.detail;
    news.slug = req.body.slug || news.slug;

    await news.save();
    res
      .status(200)
      .json({ message: "Update news successfully", success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

// Delete a news by id
exports.deleteNews = async (req, res) => {
  try {
    const result = await New.deleteOne({ _id: req.params.id });
    console.log(result);
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "News not found", success: false });
    }
    res.json({ message: "News deleted successfully", success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

exports.getRandomNews = async (req, res) => {
  try {
    const randomNews = await New.aggregate([
      { $sample: { size: 4 } }, // Lấy ngẫu nhiên 4 tài liệu
    ]);
    res.status(200).json(randomNews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
