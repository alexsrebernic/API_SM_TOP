const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema(
    {
      profileImg:{type:Buffer,required:true},
      username: {type: String, required: true, maxLength: 25},
      password: {type:String,required:true},
      details:{type:String,required:false},
      posts:[{type:Schema.Types.ObjectId,required:false,ref:"Post"}],
      friends:[{type:Schema.Types.ObjectId,required:false,ref:"User"}],
      chats:[{type:Schema.Types.ObjectId,required:false,ref:"Chat"}],
      notifications:[{type:Schema.Types.ObjectId,required:false,ref:"Notification"}]
    }
  );

module.exports = mongoose.model('User', userSchema);
