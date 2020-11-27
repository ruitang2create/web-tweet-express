const utils = require('../utils');
const passport = require('passport');
const Users = require('../models/users');
const express = require('express');
const router = express.Router();

const Tweets = require('../models/tweets');
router.get('/', utils.requireLogin, (req, res) => res.render('index'));
router.get('/login', (req, res) => res.render('login'));
router.get('/signup', (req, res) => res.render('signup'));
router.post('/login', passport.authenticate('local'), (req, res) => {
    res.redirect('/');
});
router.post('/signup', (req, res, next) => {
    const { username, password, confirmPassword } = req.body;
    if (password === confirmPassword) {
        Users.register(new Users({ username, name: username }), password, (err, user) => {
            if (err) {
                return next(err);
            }

            passport.authenticate('local')(req, res, () => {
                return res.redirect('/');
            });
        });
    } else {
        return next({ message: 'Password does not match' });
    }
});
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router;