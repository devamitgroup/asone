const Info = require("../models/Info");

// Get the introduction page
exports.getIntroduction = async (req, res) => {
  try {
    const intro = await Info.findOne(); // Lấy phần tử đầu tiên (hoặc duy nhất)
    if (!intro) {
      return res.status(404).json({ message: "Introduction not found" });
    }

    res.render("admin/gioi-thieu", { intro });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getIntroductionClient = async (req, res, next) => {
  try {
    const intro = await Info.findOne(); // Lấy phần tử đầu tiên (hoặc duy nhất)
    if (!intro) {
      next();
      return;
    }
    res.locals.intro = intro;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update the introduction
exports.updateIntroduction = async (req, res) => {
  try {
    const update = {
      ...req.body,
      avt: req.file ? req.file.path : undefined, // Cập nhật hình ảnh chỉ khi có file mới
    };
    const intro = await Info.findOneAndUpdate({}, update, {
      new: true,
    });
    if (!intro) {
      return res.status(404).json({ message: "Introduction not found" });
    }
    res.status(200).json(intro);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.createIntroduction = async (req, res) => {
  try {
    const { name, describe } = req.body;
    const avt = req.file ? req.file.path : ""; // Đảm bảo không xảy ra lỗi nếu không có file

    const exists = await Info.findOne(); // Kiểm tra xem đã có bản ghi nào chưa
    if (exists) {
      return res.status(400).json({ message: "Introduction already exists" });
    }

    const newIntro = new Info({
      name,
      describe,
      avt,
    });

    await newIntro.save(); // Lưu vào database sử dụng instance 'newIntro'
    res.status(201).json(newIntro);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
