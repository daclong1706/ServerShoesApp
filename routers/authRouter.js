const Router = require("express");

const authRouter = Router();

authRouter.post("/register", (req, res) => {
  console.log(req.body);
  res.send("OK!");
});

module.exports = authRouter;
