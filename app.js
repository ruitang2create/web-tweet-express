const express = require('express');
const app = express();

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger('dev'));

app.get('/', (req, res) => {
    // find index.html using absolue path
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.send(err.message);
});

app.listen(3000, () => console.log('Listening on port: 3000......'));