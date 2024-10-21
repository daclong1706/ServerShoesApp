const Router = require("express");
const {
  register,
  login,
  verification,
} = require("../../controllers/auth.controller");

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/verification", verification);

module.exports = authRouter;
