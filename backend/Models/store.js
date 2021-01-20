const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const storeSchema = new Schema({
    
   userId:{type:String,required:true},//{type:mongoose.Schema.Types.ObjectId,required:true},
   name:{type:String,required:true},
   files:[
      {
         name:{type:String,required:true},
         url:{type:String,required:true},
         type:{type:String,required:true},
         isShared:{type:Boolean,default:false},
      }
   ],
   isShared:{type:Boolean,default:false},
   type:{type:String,default:"folder"}
},{timestamps:true})

const Store = mongoose.model('Store',storeSchema);
module.exports = Store;