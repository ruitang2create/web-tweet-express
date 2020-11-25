const utils = require('../utils');
const express = require('express');
const router = express.Router();
const Users = require('../models/users');
const Tweets = require('../models/tweets');

router.get('/', utils.requireLogin, (req, res) => {
    Tweets.find({ author: req.user._id })
    .populate('author')
    .exec()
    .then(tweets => {
        res.render('profile', { tweets });
    }).catch(err => {
        next(err);
    });
});

router.post('/', utils.requireLogin, (req, res) => {
    res.json(req.body);
});

router.get('/edit', utils.requireLogin, (req, res) => {
    Tweets.find({ author: req.user._id })
    .populate('author')
    .exec()
    .then(tweets => {
        res.render('editProfile', { tweets });
    }).catch(err => {
        next(err);
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