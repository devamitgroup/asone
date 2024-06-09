const Manufacturer = require("../models/Manufacturer"); // Đảm bảo đường dẫn đúng
const Product = require("../models/Product");
// Lấy danh sách tất cả nhà sản xuất
exports.listManufacturers = async (req, res) => {
	try {
		const manufacturers = await Manufacturer.find();
		// res.json(manufacturers);
		res.render("admin/hang-san-xuat", { manufacturers });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.listManufacturersUser = async (req, res) => {
	try {
		const manufacturers = await Manufacturer.find();
		res.json(manufacturers);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Tạo nhà sản xuất mới
exports.createManufacturer = async (req, res) => {
	const manufacturer = new Manufacturer({
		name: req.body.name,
	});

	try {
		const newManufacturer = await manufacturer.save();
		res.json({ success: true });
	} catch (err) {
		res.json({ success: false, message: err });
	}
};

// Lấy thông tin chi tiết một nhà sản xuất
exports.readManufacturer = async (req, res) => {
	try {
		const manufacturer = await Manufacturer.findById(req.params.id);
		if (!manufacturer) {
			return res.status(404).json({ message: "Manufacturer not found" });
		}
		res.json(manufacturer);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Cập nhật thông tin nhà sản xuất
exports.updateManufacturer = async (req, res) => {
	try {
		const manufacturer = await Manufacturer.findById(req.params.id);
		if (!manufacturer) {
			return res.status(404).json({ message: "Manufacturer not found" });
		}
		manufacturer.name = req.body.name;
		const updatedManufacturer = await manufacturer.save();
		res.json(updatedManufacturer);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

exports.deleteManufacturer = async (req, res) => {
	try {
		const manufacturerId = req.params.id;
		const manufacturer = await Manufacturer.findById(manufacturerId);
		if (!manufacturer) {
			return res.status(404).json({ message: "Manufacturer not found" });
		}

		// Xóa tất cả sản phẩm liên quan đến nhà sản xuất này
		await Product.deleteMany({ manufacturer: manufacturerId });

		// Sau khi đã xóa các sản phẩm, tiến hành xóa nhà sản xuất
		await manufacturer.deleteOne({ _id: req.params.id });
		res.status(200).json({
			message: "Xóa thành công hãng sản xuất và tất cả sản phẩm liên quan",
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
