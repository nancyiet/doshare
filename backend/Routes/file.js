const router = require("express").Router();
const File = require("../Models/file");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');
const User = require('../Models/user');
const Folder = require('../Models/folder');

 //generate file

 router.post('/',jsonParser,(req,res)=>{
      
    User.exists({_id:req.body.userId},(err,result)=>{
        if(err)
        {
            res.status(400).send({Error:err})
        }
        else if(result)
        {
            Folder.exists({_id:req.body.folderId},(err,result)=>{
                if(err)
                {
                 res.status(400).send({Error:err})
                }
                else if(result)
                {
                    const file = new File({
                        userId:mongoose.Types.ObjectId(req.body.userId),
                        folderId:mongoose.Types.ObjectId(req.body.folderId),
                         name:req.body.name,
                         type:req.body.type,
                         url:req.body.url, 
                         filename:req.body.filename,
                    })
                    file.save().then(result=>{
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
        }
        else{
        ;
            res.sendStatus(404);
        }
       
    })
      

 })

 // delete file

 router.delete('/:id',(req,res)=>{
     File.findByIdAndDelete(req.params.id,(err,file)=>{
         if(err)
         {
             res.status(400).send({Error:err});
         }
         else
         {
             res.status(200).send({data:file});
         }
     })
 })
//get files of a folder
router.get('/:id',(req,res)=>{
   
    File.find({folderId:mongoose.Types.ObjectId(req.params.id)},(err,files)=>{
       if(err)
       {
        res.status(400).send({Error:err});
       }
       else
       {
           console.log(files);
        res.status(200).send({data:files});
       }
    })
})
// get all files
router.get('/all/:id',(req,res)=>{
   
    File.find({userId:mongoose.Types.ObjectId(req.params.id)},(err,files)=>{
       if(err)
       {
        res.status(400).send({Error:err});
       }
       else
       {
           console.log(files);
        res.status(200).send({data:files});
       }
    })
})
module.exports = router;