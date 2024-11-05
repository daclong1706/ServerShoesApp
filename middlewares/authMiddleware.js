const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const UserModel = require("../src/models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Kiểm tra xem có token trong header Authorization hay không
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Lấy token từ header
      token = req.headers.authorization.split(" ")[1];

      // Giải mã token để lấy thông tin user ID
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      // Lấy thông tin user từ database và gán vào `req.user`
      req.user = await UserModel.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
