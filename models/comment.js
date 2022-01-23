const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content:{type:String,required:false,minlength:1},
    author_id:{type:Schema.Types.ObjectId, ref:"User",required:true},
    author_full_name:{type:String,required:true},
    author_img:{type:Buffer,required:true},
    image:{type:Buffer,required:false},
    date:{type:String,required:true},
    likes:[{type:Schema.Types.ObjectId,required:false,ref:'User'}],
    dislikes:[{type:Schema.Types.ObjectId,required:false,ref:'User'}],
    post:{type:Schema.Types.ObjectId,required:true,ref:"Post"}
})
module.exports = mongoose.model('Comment', commentSchema);
