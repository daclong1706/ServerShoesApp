const Router = require("express");
const {
  register,
  login,
  verification,
  forgotPassword,
  resetPassword,
  loginWithGoogle,
} = require("../../controllers/auth.controller");

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/verification", verification);
authRouter.post("/forgotPassword", forgotPassword);
authRouter.post("/resetPassword", resetPassword);
authRouter.post("/login-google", loginWithGoogle);

module.exports = authRouter;
