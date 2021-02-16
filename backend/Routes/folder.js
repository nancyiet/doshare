const router = require("express").Router();
const Folder = require("../Models/folder");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');
const User = require("../Models/user");
const File = require("../Models/file");
 //generate folder

 router.post('/', jsonParser,(req,res)=>{
     
    User.exists({_id:req.body.user},(err,result)=>{
        if(err)
        {
            res.status(404).send({Error:err})
        }
        else if(result)
        {
            const folder = new Folder({
                userId:mongoose.Types.ObjectId(req.body.user),
                 name:req.body.folder,
               
            })
            folder.save().then(result=>{
                res.status(200).send({data:result});
                console.log(result);
              }
                )
            .catch(err=>res.status(400).send({Error:err}));
        }
        else{
            res.sendStatus(404);
        }
    })
     

 })

 // delete folder

 router.delete('/:id',(req,res)=>{
    
     Folder.findByIdAndDelete(req.params.id,(err,folder)=>{
         if(err)
         {
            
             res.status(400).send({Error:err});
         }
         else
         { 
             File.deleteMany({folderId:mongoose.Types.ObjectId(req.params.id)},(err,files)=>{
                 if(err)
                 {
                    res.status(400).send({Error:err});
                 }
             })
             res.status(200).send({data:folder});
         }
     })
 })
//get folders
router.get('/:id',(req,res)=>{
   
    Folder.find({userId:mongoose.Types.ObjectId(req.params.id),name:{$ne:`home-${req.params.id}`}},(err,folders)=>{
       if(err)
       {
        res.status(400).send({Error:err});
       }
       else
       {
           console.log(folders);
        res.status(200).send({data:folders});
       }
    })
})

module.exports = router;