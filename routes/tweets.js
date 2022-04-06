const express = require('express');
const router = express.Router();
const db = require('../db/models');
const asyncHandler = require('./utils');

const{Tweet} = db;
const{check,validataionResult} = require('express-validator')

const tweetNotFoundError = (id) => {
    const error = new Error(`Tweet ${id} was not found`);
    error.title = 'Tweet not found';
    error.status = 404;
    return error;
}

router.get('/',asyncHandler(async(req,res) =>{
    // res.json({message:'test tweets index'});
    const tweets = await Tweet.findAll();
    res.json({tweets});
}));

router.get('/:id(\\d+)',asyncHandler(async(req,res,next) => {
    const id = req.params.id;
    const foundTweet = await Tweet.findByPk(id);
    if(!foundTweet){
        const tweetError = tweetNotFoundError(id)
        next(tweetError);
    }else{
        res.json({foundTweet});
    }
}))



module.exports = router;
