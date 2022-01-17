const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
    {
        cover_img:{type:Buffer,required:false},
        title:{type:String,required:true,maxlength:30,minlength:1},
        sub_title:{type:String,required:false,maxlength:30,minlength:1},
        content:{type:String,required:true,minlength:1},
        images:[{type:Buffer,required:false}],
        author:{type:Schema.Types.ObjectId, ref:'User',required:true},
        date:{type:String,required:true},
        published:{type:Boolean,required:true},
        comments:[{type:Schema.Types.ObjectId,required:false,ref:'Comment'}],
        social_media_urls:[{type:String,required:false}],
        likes:{type:Number,required:false},
        dislikes:{type:Number,required:false}
    }
)

module.exports = mongoose.model('Post',postSchema)