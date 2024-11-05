/** @format */

const express = require("express");
const cors = require("cors");
const authRouter = require("./src/routers/authRouter");
const shoesRouter = require("./src/routers/shoesRouter"); // Import shoesRouter
const favoritesRouter = require("./src/routers/favoritesRouter");
const connectDB = require("./src/configs/connectDb");
const errorMiddleHandle = require("./middlewares/errorMiddleware");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối đến cơ sở dữ liệu
connectDB();

// Các biến môi trường
const PORT = process.env.PORT || 3001;

// Đăng ký các router cho ứng dụng
app.use("/auth", authRouter); // Router cho xác thực người dùng
app.use("/product", shoesRouter); // Router cho quản lý giày dép
app.use("/favorites", favoritesRouter);

// Middleware xử lý lỗi
app.use(errorMiddleHandle);

// Bắt đầu server và lắng nghe tại cổng
app.listen(PORT, (err) => {
  if (err) {
    console.log("Error starting server:", err);
    return;
  }
  const ipAddress = getLocalIpAddress();
  console.log(`Server starting at http://${ipAddress}:${PORT}`);
});

// Lấy địa chỉ IP nội bộ của máy chủ
const os = require("os");

const getLocalIpAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const iface = interfaces[interfaceName];
    for (const alias of iface) {
      if (alias.family === "IPv4" && !alias.internal) {
        return alias.address;
      }
    }
  }
  return "localhost";
};
