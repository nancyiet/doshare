const router = require("express").Router();
const Store = require("../Models/store");
const multer = require("multer");
const path = require("path");
const {v4: uuidv4} = require("uuid");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const fs = require('fs');
const Buffer = require('buffer').Buffer;



/*let storage = multer.diskStorage({
    destination: (req,file,cb)=> cb(null,'uploads/') ,
    filename :(req,file,cb)=>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName);
    }
})
 let upload = multer({
     storage,
    
 }).single('file');


 //push file

router.post("/file",(req,res)=>{
  
    upload(req,res,(err)=>{
        if(err)
        {
            res.status(400).send({error:err.message});
        }
        console.log(req.file,req.body);
      
       
      const buff = Buffer.from(fs.readFileSync(req.file.path))
     const base64 = buff.toString('base64');
     console.log(base64);
       const file = {
        name:req.file.originalname,
        path: base64,
        type:req.file.mimetype,
        uuid:uuidv4(),
        filename:req.file.filename,
        
       }
       Store.findByIdAndUpdate(req.body.id,{$push:{files:file}},{new:true},(err,folder)=>{
           if(err)
           {
            res.status(400).send({Error:err});
           }
           else
           {

            res.status(400).send({data:folder});
           }
       })
    })
})
*/
//Delete file 
router.post("/file",(req,res)=>{
    console.log(req.body);
    const file = {
        name:req.body.name,
        url:req.body.url,
        type:req.body.type,
       
       }
       Store.findByIdAndUpdate(req.body.id,{$push:{files:file}},{new:true},(err,folder)=>{
           if(err)
           {
            res.status(400).send({Error:err});
           }
           else
           {

            res.status(200).send({data:folder});
           }
       })
    
})
router.delete('/file/:folderId/:fileId',(req,res)=>{
      console.log(req.params.folderId,req.params.fileId)   
     Store.findByIdAndUpdate(req.params.folderId,{$pull:{files:{_id:req.params.fileId}}},(err,folder)=>{
        if(err)
        {
         res.status(400).send({Error:err});
        }
        else
        {
            
         res.status(200).send({data:folder});
        }
     })
})

//Get files
router.get('/:id/file',(req,res)=>{
     Store.findById(req.params.id,(err,folder)=>{
        if(err)
        {
         res.status(400).send({Error:err});
        }
        else
        { 
            if(folder)
            {
                console.log(folder.files)
                res.status(400).send(folder.files);
            }
           
        }
     })
})
 //generate folder

 router.post('/folder',(req,res)=>{
      const folder = new Store({
          userId:req.body.user,
           name:req.body.folder,
          files:[],
      })
      folder.save().then(result=>{
          res.status(200).send(result);
          console.log(result);
        }
          )
      .catch(err=>res.status(400).send({Error:err}));

 })

 // delete folder

 router.delete('/folder/:id',(req,res)=>{
     Store.findByIdAndDelete(req.params.id,(err,folder)=>{
         if(err)
         {
             res.status(400).send({Error:err});
         }
         else
         {
             res.status(200).send({data:folder});
         }
     })
 })
//get folders
router.get('/folder/:id',(req,res)=>{
    console.log(req.params.id)
    Store.find({userId:req.params.id,name:{$ne:`home-${req.params.id}`}},(err,folders)=>{
       if(err)
       {
        res.status(400).send({Error:err});
       }
       else
       {
           console.log(folders);
        res.status(200).send(folders);
       }
    })
})

module.exports = router;