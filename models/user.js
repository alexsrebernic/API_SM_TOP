const mongoose = require('mongoose');
const { DateTime } = require("luxon");
const Schema = mongoose.Schema;

var userSchema = new Schema(
    {
      username: {type: String, required: true, maxLength: 25},
      password: {type:String,required:true},
      isAdmin:{type:Boolean,required:true}
    }
  );

module.exports = mongoose.model('User', userSchema);
