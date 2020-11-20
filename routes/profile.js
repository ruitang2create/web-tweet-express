const express = require('express');
const router = express.Router();
const tweets = require('../tweets');

router.get('/', (req, res) => res.render('profile', { tweets }));
router.get('/edit', (req, res) => res.render('editProfile', { tweets }));

module.exports = router;