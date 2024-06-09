const Contact = require("../models/Contact");

exports.getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOne();
    if (!contact) {
      next();
      return;
    }
    res.locals.contact = contact;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createContact = async (req, res) => {
  try {
    const { content } = req.body;
    const contact = new Contact({
      content,
    });
    await contact.save();
    res.status(200).json({ message: "Contact created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const updateData = { content: req.body.content };
    const contact = await Contact.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }); // 'new: true' để trả về đối tượng đã cập nhật

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res
      .status(200)
      .json({ message: "Contact updated successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
