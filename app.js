const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const config = require('./src/helpers/config');

require('./src/models');
const index = require('./src/routes');


const app = express();


mongoose.Promise = bluebird;
mongoose.connect(config.mongoUrl, {
  useMongoClient: true,
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if (res.headersSent) {
    return next(err);
  }

  res
    .status(err.status || 500)
    .json({ success: false, error: { status: err.status, message: err.message } });
  return next();
});


module.exports = app;
