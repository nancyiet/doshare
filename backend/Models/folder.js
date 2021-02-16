const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const folderSchema = new Schema({
    
   userId:{type:mongoose.Schema.Types.ObjectId,required:true},
   name:{type:String,required:true},
   type:{type:String,default:"folder"}
},{timestamps:true})

const Folder = mongoose.model('Folder',folderSchema);
module.exports = Folder;