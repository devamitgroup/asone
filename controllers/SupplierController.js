const Supplier = require("../models/Supplier");

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json({ suppliers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get supplier by slug
exports.getSupplierBySlug = async (req, res, next) => {
  try {
    const supplier = await Supplier.findOne({ slug: req.params.slug });

    if (!supplier) {
      next();
      return;
    }
    res.locals.supplier = supplier;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// add supplier
exports.addSupplier = async (req, res) => {
  try {
    const { detail, slug, name } = req.body;
    const avt = req.file.path;
    const supplier = new Supplier({
      name,
      avt,
      detail,
      slug,
    });
    await supplier.save();
    res.status(200).json({ message: "Supplier added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update supplier by id
exports.updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    supplier.name = req.body.name || supplier.name;
    supplier.slug = req.body.slug || supplier.slug;
    if (req.file) {
      supplier.avt = req.file.path;
    }
    supplier.detail = req.body.detail || supplier.detail;
    await supplier.save();
    res
      .status(200)
      .json({ message: "Supplier updated successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

//delete supplier by id
exports.deleteSupplier = async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
