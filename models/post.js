const mongoose = require('mongoose');
const { DateTime } = require("luxon");
const Schema = mongoose.Schema;

const postSchema = new Schema(
    {
        cover_img:{type:File,required:true},
        title:{type:String,required:true,maxlength:30,minlength:1},
        sub_title:{type:String,required:false,maxlength:30,minlength:1},
        content:{type:String,required:true,minlength:1},
        images:[{type:File,required:false}],
        tags:[{type:Schema.Types.ObjectId, ref:'Tag',required:true}],
        author:{type:Schema.Types.ObjectId, ref:'User',required:true},
        date:{type:String,required:true},
        published:{type:Boolean,required:true},
        social_media_urls:[{type:String,required:false}]
    }
)

module.exports = mongoose.model('Post',postSchema)