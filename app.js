const express = require('express');
const app = express();

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');

const tweets = require('./tweets');
const index = require('./routes/index');
const profile = require('./routes/profile');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));

app.locals.moment = require('moment');

app.use('/', index);
app.use('/profile', profile);

app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.send(err.message);
});

app.listen(3000, () => console.log('Listening on port: 3000......'));