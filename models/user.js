const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema(
    {
      profile_img:{type:Buffer,required:false},
      email:{type:String,required:true},
      first_name: {type: String, required: true, maxLength: 25},
      last_name: {type: String, required: true, maxLength: 25},
      full_name:{type:String,required:true},
      date_of_birth:{type:String,required:true},
      gender:{type:String,required:false},
      password: {type:String,required:true},
      details:{type:String,required:false},
      location:{type:String,required:false},
      posts:[{type:Schema.Types.ObjectId,required:false,ref:"Post"}],
      friends:[{type:Schema.Types.ObjectId,required:false,ref:"User"}],
      chats:[{type:Schema.Types.ObjectId,required:false,ref:"Chat"}],
      notifications:[{type:Schema.Types.ObjectId,required:false,ref:"Notification"}]
    }
  );

module.exports = mongoose.model('User', userSchema);
