var createError = require('http-errors');
var express = require('express');
const mongoose = require('mongoose')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv')
const bodyParser = require("body-parser");
var compression = require('compression');
dotenv.config()
const app = express()
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server,{cors:'https://61f98c0ae776030007b51dc4--condescending-chandrasekhar-2a90a5.netlify.app'})
module.exports = {io}
const ioServer = require('./utils/websocket/index')
// MONGO DB CONNECTION
var dev_db_url = 'mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true'
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const apiRouter = require('./routes/api')
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://61f98c0ae776030007b51dc4--condescending-chandrasekhar-2a90a5.netlify.app");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
  next();
});

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
    // render the error page
    res.status(err.status || 500);
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });  });
server.listen(process.env.PORT || 4000,() => {
  console.log('listening on port 4000')
})