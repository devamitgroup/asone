const Hotline = require("../models/Hotline");

exports.getIntroduction = async (req, res) => {
  try {
    const hotline = await Hotline.findOne(); // Lấy phần tử đầu tiên (hoặc duy nhất)
    if (!hotline) {
      return res.status(404).json({ message: "Introduction not found" });
    }

    res.status(200).json(hotline);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update first hotline

exports.updateIntroduction = async (req, res) => {
  try {
    const { phone, email } = req.body;

    const hotline = await Hotline.findOne(); // Lấy phần tử đầu tiên (hoặc duy nhất)

    if (!hotline) {
      return res.status(404).json({ message: "Introduction not found" });
    }

    hotline.phone = phone;
    hotline.email = email;

    await hotline.save();
    res.status(200).json({ hotline, message: "Introduction updated" }); // Sửa ở đây
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createIntroduction = async (req, res) => {
  try {
    const { phone, email } = req.body;

    const exists = await Hotline.findOne(); // Kiểm tra xem đã có bản ghi nào chưa
    if (exists) {
      return res.status(400).json({ message: "Introduction already exists" });
    }

    const newHotline = new Hotline({
      phone,
      email,
    });
    const hotline = await newHotline.save();
    res.status(201).json(hotline);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
