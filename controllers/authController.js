const UserModel = require("../src/models/userModel");
const bcrypt = require("bcrypt");
const asyncHandle = require("express-async-handler");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USERNAME_EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Generate JWT Token
const getJsonWebToken = (email, id) => {
  const payload = { email, id };
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "7d" });
};

// Function to send email using Nodemailer
const handleSendMail = async (emailOptions) => {
  try {
    await transporter.sendMail(emailOptions);
    return "OK";
  } catch (error) {
    throw new Error("Cannot send email. Please try again.");
  }
};

// Verification
const verification = asyncHandle(async (req, res) => {
  const { email } = req.body;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    res.status(409);
    throw new Error("Email is already in use. Try logging in instead.");
  }

  const verificationCode = Math.floor(1000 + Math.random() * 9000);
  const mailOptions = {
    from: `Support Shoes Application <${process.env.USERNAME_EMAIL}>`,
    to: email,
    subject: "Verification email code",
    text: `Your verification code is: ${verificationCode}`,
    html: `<h1>${verificationCode}</h1>`,
  };

  await handleSendMail(mailOptions);

  res.status(200).json({
    message: "Verification code sent successfully.",
    data: { code: verificationCode },
  });
});

// Register
const register = asyncHandle(async (req, res) => {
  const { email, username, password } = req.body;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    res.status(409);
    throw new Error("Email already in use. Try logging in instead.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await UserModel.create({
    email,
    name: username || "",
    password: hashedPassword,
  });

  res.status(201).json({
    message: "User registered successfully.",
    data: {
      email: newUser.email,
      id: newUser._id,
      accesstoken: getJsonWebToken(email, newUser._id),
      photo: existingUser.photo,
      name: existingUser.name,
    },
  });
});

// Login
const login = asyncHandle(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await UserModel.findOne({ email });
  const isMatchPassword = existingUser
    ? await bcrypt.compare(password, existingUser.password)
    : false;

  if (existingUser && isMatchPassword) {
    res.status(200).json({
      message: "Login successfully.",
      data: {
        id: existingUser._id,
        email: existingUser.email,
        accesstoken: getJsonWebToken(email, existingUser._id),
        photo: existingUser.photo,
        name: existingUser.name,
      },
    });
  } else {
    res.status(400).json({ message: "Invalid email or password." });
  }
});

// Forgot Password
const forgotPassword = asyncHandle(async (req, res) => {
  const { email } = req.body;

  const existingUser = await UserModel.findOne({ email });
  if (!existingUser) {
    return res.status(404).json({ message: "Email not found." });
  }

  const passwordCode = Math.floor(1000 + Math.random() * 9000);
  const mailOptions = {
    from: `Support Shoes Application <${process.env.USERNAME_EMAIL}>`,
    to: email,
    subject: "Password Recovery",
    text: `Your password recovery code is: ${passwordCode}`,
    html: `<h1>${passwordCode}</h1>`,
  };

  await handleSendMail(mailOptions);

  res.status(200).json({
    message: "Password recovery code sent successfully.",
    data: { code: passwordCode },
  });
});

// Reset Password
const resetPassword = asyncHandle(async (req, res) => {
  const { email, newPassword } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json({
    message: "Password has been reset successfully.",
  });
});

// Login with Google
const loginWithGoogle = asyncHandle(async (req, res) => {
  const user = req.body;
  const existingUser = await UserModel.findOneAndUpdate(
    { email: user.email },
    { ...user, updatedAt: Date.now() },
    { new: true, upsert: true }
  );

  const account = {
    ...existingUser.toObject(),
    accesstoken: getJsonWebToken(existingUser.email, existingUser._id),
  };

  res.status(200).json({
    message: "Login with Google successfully.",
    data: account,
  });
});

module.exports = {
  register,
  login,
  verification,
  forgotPassword,
  resetPassword,
  loginWithGoogle,
};
