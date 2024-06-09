const Account = require("../models/Account");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

exports.register = async (req, res) => {
  try {
    const { username, password, role, email } = req.body;
    console.log(req.body);
    const account = await Account.findOne({ username });
    if (account) {
      return res
        .status(400)
        .json({ message: "Username already exists", success: false });
    }
    if (!password) {
      return res
        .status(400)
        .json({ message: "Password is required", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAccount = new Account({
      username,
      password: hashedPassword,
      role,
      email,
    });
    await newAccount.save();
    res
      .status(201)
      .json({ message: "Account created successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
//login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const account = await Account.findOne({ username });
    if (!account) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, account.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Trả về thông tin người dùng
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: account._id,
        username: account.username,
        // Bất kỳ thông tin nào khác mà bạn muốn trả về
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//logout
exports.logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//get all accounts
exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get account by id
exports.getAccountById = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// update account
exports.updateAccount = async (req, res) => {
  try {
    const { username, password, role, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await Account.findByIdAndUpdate(req.params.id, {
      username,
      password: hashedPassword,
      role,
      email,
    });
    res.status(200).json({ message: "Account updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// delete account
exports.deleteAccount = async (req, res) => {
  try {
    await Account.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.params.id;

    // Tìm tài khoản sử dụng ID
    const account = await Account.findById(userId);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Kiểm tra mật khẩu hiện tại
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      account.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash mật khẩu mới và cập nhật vào cơ sở dữ liệu
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await Account.findByIdAndUpdate(userId, { password: hashedNewPassword });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { username } = req.params; // Nhận ID từ URL params
  try {
    const account = await Account.findOne({ username });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    const newPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    account.password = hashedPassword;
    await account.save();

    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "nguyentuanamit@gmail.com",
        pass: "ksma uwvz oreu obod",
      },
    });

    let mailOptions = {
      from: "nguyentuanamit@gmail.com",
      to: account.email,
      subject: "Your New Password",
      text: `Your new password is: ${newPassword}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to send email" });
      } else {
        console.log("Email sent: " + info.response);
        res
          .status(200)
          .json({ message: "Password has been reset and sent to your email" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
