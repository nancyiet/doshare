const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const shareSchema = new Schema({
    
   userId:{type:mongoose.Schema.Types.ObjectId,required:true},
   name:{type:String,required:true},
   url:{type:String,required:true},
   type:{type:String,required:true},
         

},{timestamps:true})

const Share = mongoose.model('Share',shareSchema);
module.exports = Share;