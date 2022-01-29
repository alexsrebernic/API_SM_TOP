const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    author:{type:Schema.Types.ObjectId, ref:"User",required:true},
    comment:{type:Boolean,required:false,},
    like:{type:Boolean,required:false,},
    friend_request:{type:Boolean,required:false,ref:"User"},
    post:{type:Schema.Types.ObjectId, ref:"Post",required:false},
    clicked:{type:Boolean,required:true},

})
module.exports = mongoose.model('Notification',notificationSchema)
