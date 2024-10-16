const UserModel = require("../src/models/userModel");
const bcrypt = require("bcrypt");
const asyncHandle = require("express-async-handler");
const jwt = require("jsonwebtoken");

const getJsonWebToken = async (email, id) => {
  console.log(email, id);
  const payload = {
    email,
    id,
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });

  return token;
};

const register = asyncHandle(async (req, res) => {
  const { email, username, password } = req.body;

  const existingUser = await UserModel.findOne({ email });

  console.log(existingUser);

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
      accessToken: await getJsonWebToken(email, newUser.id),
    },
  });
});

module.exports = {
  register,
};
