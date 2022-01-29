const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
    {
        content:{type:String,required:true,minlength:1},
        images:[{type:Buffer,required:false}],
        author:{type:Schema.Types.ObjectId, ref:'User',required:true},
        date:{type:Date,required:true},
        comments:[{type:Schema.Types.ObjectId,required:false,ref:'Comment'}],
        likes:[{type:Schema.Types.ObjectId,required:false,ref:'User'}],
        dislikes:[{type:Schema.Types.ObjectId,required:false,ref:'User'}]
    }
);
postSchema.statics.paginate = function(pageNo, callback){

    var limit = 10;
    var skip = pageNo * (limit);
    var totalCount;
    
    this.count({}, function(err, count){
        if(err){
            totalCount = 0;
        }
        else{
            totalCount = count;
        }
    })
    if(totalCount == 0){
        return callback('No Document in Database..', null);
    }
    //get paginated documents
    this.find().sort({'date':-1}).skip(skip).limit(limit).populate("author",{full_name:1,profileImg:1,_id:1}).exec(function(err, docs){

        if(err){
            return callback('Error Occured', null);
        }
        else if(!docs){
            return callback('Docs Not Found', null);
        }
        else{
            var result = {
                "totalRecords" : totalCount,
                "page": pageNo,
                "nextPage": pageNo + 1,
                "result": docs
            };
            return callback(null, result);
        }

    });

};
module.exports = mongoose.model('Post',postSchema)