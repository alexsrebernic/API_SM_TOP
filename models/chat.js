const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    user1:{type:Schema.Types.ObjectId, ref:"User",required:true},
    user2:{type:Schema.Types.ObjectId, ref:"User",required:true},
    messages:[{type:Schema.Types.ObjectId, ref:"Message",required:false}],

})
module.exports = mongoose.model('Chat', chatSchema);
