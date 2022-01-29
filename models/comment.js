const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content:{type:String,required:false,minlength:1},
    author:{type:Schema.Types.ObjectId, ref:"User",required:true},
    image:{type:Buffer,required:false},
    date:{type:Date,required:true},
    likes:[{type:Schema.Types.ObjectId,required:false,ref:'User'}],
    dislikes:[{type:Schema.Types.ObjectId,required:false,ref:'User'}],
    post:{type:Schema.Types.ObjectId,required:true,ref:"Post"}
})

module.exports = mongoose.model('Comment', commentSchema);
