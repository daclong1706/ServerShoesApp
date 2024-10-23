/**@format */

const express = require("express");
const cors = require("cors");
const authRouter = require("./src/routers/authRouter");
const connectDB = require("./src/configs/connectDb");
const errorMiddleHandle = require("./middlewares/errorMiddleware");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

const PORT = 3001;

app.use("/auth", authRouter);

connectDB();

app.use(errorMiddleHandle);

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  const ipAddress = getLocalIpAddress();
  console.log(`Server starting at http://${ipAddress}:${PORT}`);
});

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
