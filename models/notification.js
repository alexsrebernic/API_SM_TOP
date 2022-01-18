const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    author:{type:Schema.Types.ObjectId, ref:"User",required:false},
    post:{type:Schema.Types.ObjectId,required:false,ref:"Post"},

})