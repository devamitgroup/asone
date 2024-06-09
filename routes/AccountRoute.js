const express = require("express");
const router = express.Router();
const accountController = require("../controllers/AccountController");

router.get("/admin/tai-khoan", (req, res) => {
  res.render("admin/account.ejs", { title: "Tài khoản của tôi" });
});

router.get("/list-tai-khoan", (req, res) => {
  res.render("admin/list-account.ejs", { title: "Danh sách tài khoản" });
});

router.get("/them-tai-khoan", (req, res) => {
  res.render("admin/add-account.ejs", { title: "Thêm tài khoản" });
});

router.post("/register", accountController.register);
router.post("/login", accountController.login);
router.post("/logout", accountController.logout);
router.get("/all", accountController.getAllAccounts);
router.get("/:id", accountController.getAccountById);
router.delete("/delete/:id", accountController.deleteAccount);
router.put("/delete/:id", accountController.updateAccount);
router.post("/change-password/:id", accountController.changePassword);
router.post("/reset-password/:username", accountController.resetPassword);

module.exports = router;
