const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/uploads/"); // Đường dẫn thư mục để lưu trữ ảnh
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname)); // Tạo tên file duy nhất
	},
});

const upload = multer({ storage: storage });

module.exports = upload;
