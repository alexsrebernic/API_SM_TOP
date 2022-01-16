const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema(
    {
      username: {type: String, required: true, maxLength: 25},
      password: {type:String,required:true},
    }
  );

module.exports = mongoose.model('User', userSchema);
