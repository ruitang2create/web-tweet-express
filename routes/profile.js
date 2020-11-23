const utils = require('../utils');
const express = require('express');
const router = express.Router();
// const tweets = require('../tweets');

// router.get('/', (req, res) => res.render('profile', { tweets }));
const Tweets = require('../models/tweets');
router.get('/', utils.requireLogin, (req, res) => {
    Tweets.find({}, (err, tweets) => {
        res.render('profile', { tweets });
    });
});

router.get('/edit', utils.requireLogin, (req, res) => {
    Tweets.find({}, (err, tweets) => {
        res.render('editProfile', { tweets });
    });
});

module.exports = router;