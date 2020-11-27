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

router.put('/', utils.requireLogin, (req, res) => {
    console.log('Getting update request from front-end...');
    const tweetID = req.body.tweetID;
    const newContent = req.body.newContent;
    Tweets.findByIdAndUpdate({_id: tweetID}, {content: newContent})
    .then(() => {
        console.log('Tweet(' + tweetID + ') updated!');
    })
    .catch(err => {
        next(err);
    })
    res.json({ updated: true });
});

router.delete('/:id/delete', utils.requireLogin, (req, res) => {
    const dest = req.body.currUrl;
    console.log('Getting delete request from ' + dest);
    const targetId = req.params.id;
    Tweets.deleteOne({_id: targetId})
    .then(() => {
        console.log('Tweet(' + targetId + ') deleted!');
        res.json({
            message: 'Tweet deleted!',
            deleted: true,
        });
    }).catch(err => next(err));
});

module.exports = router;