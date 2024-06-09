const Product = require("../models/Product"); // Đảm bảo đường dẫn này đúng
const Manufacturer = require("../models/Manufacturer");
const Category = require("../models/Category");
const Subcategory = require("../models/SubCategory");
exports.createProduct = async (req, res) => {
  const {
    name,
    category,
    manufacturer,
    slug,
    model,
    idProduct,
    detailProduct,
    bestSelling,
    describe,
  } = req.body;
  const images = req.files.map((file) => file.path); // Lấy mảng các đường dẫn ảnh từ các file đã tải lên

  try {
    const newProduct = new Product({
      name,
      images, // Lưu mảng đường dẫn ảnh
      category,
      manufacturer,
      slug,
      model,
      idProduct,
      detailProduct,
      bestSelling,
      describe,
    });
    await newProduct.save();
    res.status(200).json({ message: "Thêm sản phẩm thành công" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.listProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 36;
  const { manufacturerId } = req.query; // Lấy manufacturerId từ query params

  // Tính toán số lượng bỏ qua
  const skip = (page - 1) * limit;

  try {
    // Tạo điều kiện truy vấn cho sản phẩm
    let query = {};

    // Nếu có manufacturerId, thêm điều kiện vào truy vấn
    if (manufacturerId) {
      query.manufacturer = manufacturerId;
    }

    // Tìm sản phẩm với phân trang và điều kiện lọc
    const products = await Product.find(query)
      .populate("category")
      .populate("manufacturer")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Đếm tổng số sản phẩm để tính số trang
    const count = await Product.countDocuments(query);

    // Tính tổng số trang
    const totalPages = Math.ceil(count / limit);

    res.json({
      count,
      products,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("category", "name")
      .populate("manufacturer", "name");

    if (!product) {
      next();
      return;
    }

    res.locals.product = product; // Lưu sản phẩm vào res.locals
    next(); // Gọi middleware tiếp theo (trong trường hợp này là function trong router)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }

    // Cập nhật các thuộc tính sản phẩm
    product.name = req.body.name || product.name;
    product.images =
      req.files && req.files.length > 0
        ? req.files.map((file) => file.path)
        : product.images;
    product.category = req.body.category || product.category;
    product.manufacturer = req.body.manufacturer || product.manufacturer;
    product.slug = req.body.slug || product.slug;
    product.model = req.body.model || product.model;
    product.idProduct = req.body.idProduct || product.idProduct;
    product.detailProduct = req.body.detailProduct || product.detailProduct;
    product.bestSelling = req.body.bestSelling === "true";
    product.describe = req.body.describe || product.describe;

    await product.save();
    res.status(200).json({ message: "Sửa sản phẩm thành công", success: true });
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const result = await Product.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }
    res.json({ message: "Product deleted successfully", success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

exports.searchProductsByKeyword = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    if (typeof keyword !== "string" || !keyword.trim()) {
      return res
        .status(400)
        .json({ message: "Keyword must be a non-empty string" });
    }
    const searchRegex = new RegExp(keyword, "i"); // Tạo RegExp từ keyword

    let query = {
      $or: [
        { name: { $regex: searchRegex } },
        { model: { $regex: searchRegex } },
        { idProduct: { $regex: searchRegex } },
      ],
    };

    // Tìm kiếm Manufacturer và Category theo tên
    const manufacturerMatch = await Manufacturer.find({
      name: { $regex: searchRegex },
    });
    const categoryMatch = await Category.find({
      name: { $regex: searchRegex },
    });

    if (manufacturerMatch.length > 0 || categoryMatch.length > 0) {
      query.$or.push(
        { manufacturer: { $in: manufacturerMatch.map((man) => man._id) } },
        { category: { $in: categoryMatch.map((cat) => cat._id) } }
      );
    }

    const products = await Product.find(query)
      .populate("category", "name")
      .populate("manufacturer", "name");

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBestSellingProducts = async (req, res) => {
  try {
    // Lấy các sản phẩm có bestSelling là true
    const bestSellingProducts = await Product.find({ bestSelling: true })
      .populate("category", "name")
      .populate("manufacturer", "name");

    // Kiểm tra xem có sản phẩm nào không
    if (!bestSellingProducts || bestSellingProducts.length === 0) {
      return res
        .status(404)
        .json({ message: "No best selling products found." });
    }

    // Trả về danh sách các sản phẩm bán chạy
    res.status(200).json(bestSellingProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductsByParentCategory = async (req, res) => {
  const { parentCategoryId } = req.params;
  const manufacturerIds = req.query.manufacturerId; // Lấy manufacturerId từ query params
  const page = parseInt(req.query.page) || 1; // Lấy số trang từ query hoặc mặc định là 1
  const limit = parseInt(req.query.limit) || 36; // Lấy số lượng sản phẩm trên một trang hoặc mặc định là 36
  const skip = (page - 1) * limit; // Tính toán số sản phẩm cần bỏ qua

  try {
    // Bước 1: Tìm tất cả các Subcategory có parentCategory là ID đã cho
    const subcategories = await Subcategory.find({
      parentCategory: parentCategoryId,
    });

    // Bước 2: Lấy ID của tất cả subcategories
    const subcategoryIds = subcategories.map((subcat) => subcat._id);

    // Bước 3: Tạo điều kiện truy vấn cho các sản phẩm
    let query = {
      category: { $in: subcategoryIds },
    };

    // Nếu có manufacturerIds, thêm điều kiện vào truy vấn
    if (manufacturerIds) {
      // Chuyển đổi manufacturerIds thành mảng nếu nó là chuỗi
      const manufacturerIdArray = Array.isArray(manufacturerIds)
        ? manufacturerIds
        : [manufacturerIds];
      query.manufacturer = { $in: manufacturerIdArray };
    }

    // Bước 4: Tìm tất cả các sản phẩm thuộc các điều kiện đã thiết lập
    const products = await Product.find(query)
      .populate("category")
      .populate("manufacturer", "name")
      .skip(skip)
      .limit(limit);

    // Đếm tổng số sản phẩm để tính số trang
    const count = await Product.countDocuments(query);

    // Tính tổng số trang
    const totalPages = Math.ceil(count / limit);

    // Kiểm tra nếu không có sản phẩm nào được tìm thấy
    if (!products.length) {
      return res.status(404).json({
        message: "No products found for the specified parent category.",
      });
    }

    // Trả về danh sách các sản phẩm cùng thông tin phân trang
    res.status(200).json({
      products,
      currentPage: page,
      totalPages,
      count,
    });
  } catch (error) {
    // Xử lý lỗi và trả về thông báo lỗi
    res.status(500).json({ message: error.message });
  }
};

exports.getProductsByCategoryId = async (req, res) => {
  const { categoryId } = req.params; // Lấy categoryId từ params
  const { slug } = req.query; // Lấy slug từ query params

  try {
    // Tìm tất cả các sản phẩm có category là categoryId và không có slug là slug truyền vào, giới hạn kết quả là 36 sản phẩm
    const products = await Product.find({
      category: categoryId,
      slug: { $ne: slug }, // Loại trừ sản phẩm có slug là slug truyền vào
    })
      .populate("category")
      .populate("manufacturer")
      .limit(36);

    // Kiểm tra nếu không có sản phẩm nào được tìm thấy
    if (!products.length) {
      return res.status(404).json({
        message: "No products found for the specified category.",
      });
    }

    // Trả về danh sách các sản phẩm
    res.status(200).json(products);
  } catch (error) {
    // Xử lý lỗi và trả về thông báo lỗi
    res.status(500).json({ message: error.message });
  }
};

exports.getProductsByCategoryChildId = async (req, res) => {
  const { categoryId } = req.params;
  const { manufacturerId } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    let query = { category: categoryId };

    if (manufacturerId) {
      query.manufacturer = manufacturerId;
    }

    const products = await Product.find(query)
      .populate("category")
      .populate("manufacturer")
      .skip(skip)
      .limit(limit);

    const count = await Product.countDocuments(query);
    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      products,
      currentPage: page,
      totalPages,
      totalCount: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
