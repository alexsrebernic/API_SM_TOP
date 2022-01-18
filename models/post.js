const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
    {
        content:{type:String,required:true,minlength:1},
        images:[{type:Buffer,required:false}],
        author:{type:Schema.Types.ObjectId, ref:'User',required:true},
        date:{type:String,required:true},
        comments:[{type:Schema.Types.ObjectId,required:false,ref:'Comment'}],
        likes:[{type:Schema.Types.ObjectId,required:false,ref:'User'}],
        dislikes:[{type:Schema.Types.ObjectId,required:false,ref:'User'}]
    }
)

module.exports = mongoose.model('Post',postSchema)