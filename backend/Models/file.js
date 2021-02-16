const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const fileSchema = new Schema({
    
   userId:{type:mongoose.Schema.Types.ObjectId,required:true},
   folderId:{type:mongoose.Schema.Types.ObjectId,required:true},
   name:{type:String,required:true},
   url:{type:String,required:true},
   type:{type:String,required:true},
   filename:{type:String,required:true}
},{timestamps:true})

const File = mongoose.model('File',fileSchema);
module.exports = File;


