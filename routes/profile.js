const utils = require('../utils');
const express = require('express');
const router = express.Router();
const Users = require('../models/users');
// const tweets = require('../tweets');

// router.get('/', (req, res) => res.render('profile', { tweets }));
const Tweets = require('../models/tweets');
const { NotExtended } = require('http-errors');
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

router.post('/edit', utils.requireLogin, (req, res) => {
    console.log("Editing profile...");
    Users.update({ _id: req.user._id }, req.body, (err) => {
        if (err) {
            return next(err);
        } else {
            return res.redirect('/profile');
        }
    });
});

router.post('/avatar', utils.requireLogin, (req, res) => {
    console.log("Editing avatar...");
    Users.update({ _id: req.user._id }, req.body, (err) => {
        if (err) {
            return next(err);
        } else {
            return res.json({ success: true });
        }
    });
});

module.exports = router;