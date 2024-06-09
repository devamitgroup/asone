const express = require("express");
const router = express.Router();
const clientController = require("../controllers/ClientController");
const upload = require("../config/multer");

router.get("/admin", (req, res) => {
  res.render("admin/khach-hang.ejs", {
    title: "Khách hàng",
    faviconPath: process.env.FAVICON_PATH,
  });
});
router.get("/", clientController.getAllClients);
router.get("/:slug", clientController.getClientBySlug);
router.post("/create", upload.single("avt"), clientController.addClient);
router.put("/update/:id", clientController.updateClient);
router.delete("/delete/:id", clientController.deleteClient);

module.exports = router;
