const express = require('express');
const utils = require('../utils');
const router = express.Router();
const Tweets = require('../models/tweets');

router.post('/', utils.requireLogin, (req, res) => {
    const tweetContent = req.body.content;
    const currUser = req.user;
    const newTweet = new Tweets({
        content: tweetContent,
        author: currUser._id,
    });
    newTweet
        .save()
        .then( newTweet => {
            console.log(`${newTweet.content} has been saved!`);
            res.redirect('/profile');
        })
        .catch( err => {
            next(err);
        });
});

module.exports = router;