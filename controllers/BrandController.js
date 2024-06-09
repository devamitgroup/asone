const Brand = require("../models/Brand");

exports.getBrand = async (req, res, next) => {
  try {
    const brands = await Brand.find();
    if (!brands) {
      next();
      return;
    }
    res.locals.brands = brands;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBrand = async (req, res) => {
  try {
    const { name, describe, detail, slug } = req.body;
    const avt = req.file.path;
    const brand = new Brand({
      name,
      avt,
      describe,
      detail,
      slug,
    });
    await brand.save();
    res
      .status(200)
      .json({ message: "Brand created successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    brand.name = req.body.name || brand.name;
    brand.slug = req.body.slug || brand.slug;
    if (req.file) {
      brand.avt = req.file.path;
    }
    brand.detail = req.body.detail || brand.detail;
    await brand.save();
    res
      .status(200)
      .json({ message: "Brand updated successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// get brand slug
exports.getBrandSlug = async (req, res, next) => {
  try {
    const brand = await Brand.findOne({ slug: req.params.slug });
    if (!brand) {
      next();
      return;
    }
    res.locals.brand = brand;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
