const express = require("express");
const router = express.Router();
const contactController = require("../controllers/ContactController");
router.get("/", contactController.getContact, (req, res) => {
  if (res.locals.contact) {
    res.render("client/lien-he.ejs", {
      title: "Liên hệ",
      contact: res.locals.contact,
      faviconPath: process.env.FAVICON_PATH,
      baseUrl: process.env.BASE_URL,
    });
  } else {
    res.status(404).render("error.ejs", { message: "Contact not found" });
  }
});
router.get("/admin", contactController.getContact, (req, res) => {
  if (res.locals.contact) {
    res.render("admin/lien-he.ejs", {
      title: "Chỉnh sửa liên hệ",
      contact: res.locals.contact,
      faviconPath: process.env.FAVICON_PATH,
    });
  } else {
    res.status(404).render("error.ejs", { message: "Contact not found" });
  }
});
router.post("/create", contactController.createContact);
router.put("/update/:id", contactController.updateContact);

module.exports = router;
