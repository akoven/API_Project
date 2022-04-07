const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { User } = require("../db/models");
const bcrypt = require("bcryptjs");
const { getUserToken } = require("../auth");
const { asyncHandler, handleValidationErrors } = require("./utils");

const validateUsername = check("username")
  .exists({ checkFalsy: true })
  .withMessage("Please provide a username");

const validateEmailAndPassword = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a password."),
];

User.prototype.validatePassword = function (password) {
  // Note that since this function is a model instance method,
  // `this` is the user instance here:
  return bcrypt.compareSync(password, this.hashedPassword.toString());
};

router.post(
  "/",
  validateUsername,
  validateEmailAndPassword,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, hashedPassword });

    const token = getUserToken(user);
    res.status(201).json({
      user: { id: user.id },
      token,
    });
  })
);

router.post(
  "/token",
  validateEmailAndPassword,
  asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user || !user.validatePassword(password)) {
      const err = new Error("Login failed");
      err.status = 401;
      err.title = "Login failed";
      err.errors = ["The provided credentials were invalid."];
      return next(err);
    }
    const token = getUserToken(user);
    res.json({ token, user: { id: user.id } });
  })
);

module.exports = router;
