const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema(
    {
      profileImg:{type:Buffer,required:true},
      username: {type: String, required: true, maxLength: 25},
      password: {type:String,required:true},
      details:{type:String,required:false},
      posts:[{type:Schema.Types.ObjectId,required:false}],
      friends:[{type:Schema.Types.ObjectId,required:false}],
      chats:[{type:Schema.Types.ObjectId,required:false}],
      notifications:[{type:Schema.Types.ObjectId,required:false}]
    }
  );

module.exports = mongoose.model('User', userSchema);
