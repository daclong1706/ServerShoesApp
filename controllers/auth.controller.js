const { error } = require("console");
const UserModel = require("../src/models/userModel");
const bcrypt = require("bcrypt");
const asyncHandle = require("express-async-handler");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.USERNAME_EMAIL,
    pass: process.env.PASSWORD,
  },
});

const getJsonWebToken = async (email, id) => {
  const payload = {
    email,
    id,
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });

  return token;
};

const handleSendMail = async (val) => {
  try {
    await transporter.sendMail(val);
    return "OK";
  } catch (error) {
    return error;
  }
};

const verification = asyncHandle(async (req, res) => {
  const { email } = req.body;

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    res.status(401);
    throw new Error(`Email already in use. Try logging in instead.`);
  }

  const verificationCode = Math.round(1000 + Math.random() * 9000);

  try {
    const data = {
      from: `Support Shoes Application <${process.env.USERNAME_EMAIL}>`,
      to: email,
      subject: "Verification email code",
      text: "Your code to verification email",
      html: `<h1>${verificationCode}</h1>`,
    };

    await handleSendMail(data);
    res.status(200).json({
      mess: "Send verification code successfully",
      data: {
        code: verificationCode,
      },
    });
  } catch (error) {
    res.status(401);
    throw new Error("Can not send email");
  }
});

const register = asyncHandle(async (req, res) => {
  const { email, username, password } = req.body;

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    res.status(401);
    throw new Error(`Email already in use. Try logging in instead.`);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new UserModel({
    email,
    username: username ?? "",
    password: hashedPassword,
  });

  await newUser.save();

  res.status(200).json({
    mess: "Register new user successfully",
    data: {
      email: newUser.email,
      id: newUser.id,
      accesstoken: await getJsonWebToken(email, newUser.id),
    },
  });
});

const login = asyncHandle(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await UserModel.findOne({ email });

  if (!existingUser) {
    res.status(403).json({
      mess: "User not found!",
    });

    throw new Error("User not found!");
  }

  const isMatchPassword = await bcrypt.compare(password, existingUser.password);

  if (!isMatchPassword) {
    res.status(401);
    throw new Error("Email or Password is not corret!");
  }

  res.status(200).json({
    mess: "Login successfully",
    data: {
      id: existingUser.id,
      email: existingUser.email,
      accesstoken: await getJsonWebToken(email, existingUser.id),
    },
  });
});

const forgotPassword = asyncHandle(async (req, res) => {
  const { email } = req.body;

  const existingUser = await UserModel.findOne({ email });

  if (!existingUser) {
    return res.status(404).json({
      mess: "Email not found.",
    });
  }
  const passwordCode = Math.round(1000 + Math.random() * 9000);

  try {
    const data = {
      from: `Support Shoes Application <${process.env.USERNAME_EMAIL}>`,
      to: email,
      subject: "Khoi phuc mat khau",
      text: "Your code to verification email",
      html: `<h1>${passwordCode}</h1>`,
    };

    await handleSendMail(data);
    res.status(200).json({
      mess: "Send email new code successfully.",
      data: {
        code: passwordCode,
      },
    });
  } catch (error) {
    res.status(401);
    throw new Error("Can not send email");
  }
});

const resetPassword = asyncHandle(async (req, res) => {
  const { email, newPassword } = req.body;

  // Tìm người dùng theo email
  const user = await UserModel.findOne({ email });

  // Nếu không tìm thấy người dùng, trả về lỗi 404
  if (!user) {
    return res.status(404).json({ mess: "Người dùng không tồn tại." });
  }

  // Mã hóa mật khẩu mới
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Cập nhật mật khẩu mới cho người dùng
  user.password = hashedPassword;
  await user.save();

  // Trả về phản hồi thành công
  res.status(200).json({
    mess: "Mật khẩu đã được đặt lại thành công",
  });
});

module.exports = {
  register,
  login,
  verification,
  forgotPassword,
  resetPassword,
};
