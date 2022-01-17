var createError = require('http-errors');
var express = require('express');
const mongoose = require('mongoose')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv')
const bodyParser = require("body-parser");
var compression = require('compression');
const jwt = require("jsonwebtoken");
const admin = require('../blog-api/addUserInDB')
dotenv.config()
const app = express()
// MONGO DB CONNECTION
var dev_db_url = 'mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true'
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
admin()

const apiRouter = require('../blog-api/routes/api')

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(compression()); 

app.use('/api',apiRouter)

app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err)
    // render the error page
    res.status(err.status || 500);
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });  });
  app.listen(3000,() => {
      console.log('app running in port 3000')
  })
  module.exports = app;