const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content:{type:String,required:true,minlength:1},
    profileImg:{type:String,required:true},
    author:{type:Schema.Types.ObjectId, ref:"User",required:true},
    date:{type:String,required:true},
    likes:{type:Number,required:false},
    dislikes:{type:Number,required:false},
    post:{type:Schema.Types.ObjectId,required:true,ref:"Post"}
})
module.exports = mongoose.model('Comment', commentSchema);
