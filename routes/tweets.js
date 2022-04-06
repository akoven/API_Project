const express = require("express");
const router = express.Router();
const db = require("../db/models");
const { asyncHandler, handleValidationErrors } = require("./utils");

const { Tweet } = db;
const { check, validationResult } = require("express-validator");

const tweetNotFoundError = (id) => {
  const error = new Error(`Tweet ${id} was not found`);
  error.title = "Tweet not found";
  error.status = 404;
  return error;
};

const tweetValidators = [
  check("message")
    .exists({ checkFalse: true })
    .withMessage("Please provide a message")
    .isLength({ max: 280 })
    .withMessage("Please make your message less than 280 characters"),
];

router.get(
  "/",
  asyncHandler(async (req, res) => {
    // res.json({message:'test tweets index'});
    const tweets = await Tweet.findAll();
    res.json({ tweets });
  })
);

router.get(
  "/:id(\\d+)",
  asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const foundTweet = await Tweet.findByPk(id);
    if (!foundTweet) {
      const tweetError = tweetNotFoundError(id);
      next(tweetError);
    } else {
      res.json({ foundTweet });
    }
  })
);

router.post(
  "/",
  tweetValidators,
  handleValidationErrors,
  asyncHandler(async (req, res, next) => {
    const { message } = req.body;
    await Tweet.create({ message });
    res.json("Tweet created");
  })
);

router.put(
  "/:id(\\d+)",
  tweetValidators,
  handleValidationErrors,
  asyncHandler(async (req, res, next) => {
    const { message } = req.body;
    const tweetId = req.params.id;
    const tweet = await Tweet.findByPk(tweetId);
    if (!tweet) {
      const tweetError = tweetNotFoundError(id);
      next(tweetError);
    } else {
      tweet.message = message;
      await tweet.save();
      res.json("Tweet updated");
    }
  })
);

router.delete(
  "/:id(\\d+)",
  tweetValidators,
  handleValidationErrors,
  asyncHandler(async (req, res, next) => {
    const tweetId = req.params.id;
    const tweet = await Tweet.findByPk(tweetId);
    if (!tweet) {
      const tweetError = tweetNotFoundError(id);
      next(tweetError);
    } else {
      tweet.destroy();
      res.json("Tweet deleted");
    }
  })
);

module.exports = router;
