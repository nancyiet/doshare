const router = require("express").Router();
const User = require("../Models/user");
const Share = require("../Models/share");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jsonParser = bodyParser.json();

router.get('/:userid',(req,res)=>{

      Share.find({userId:mongoose.Types.ObjectId(req.params.userid)},(err,files)=>{
          if(err)
          {
              res.status(400).send(err);
          }
          else if(files)
          {
              console.log(files);
             res.status(200).send({data:files});
          }
      });
})

router.post('/',jsonParser,(req,res)=>{
    console.log(req.body.email)
    User.findOne({email:req.body.email},(err,user)=>{
        if(err)
        {
            console.log(err)
            res.status(400).send(err); 
        }
        else if(user)
        {
            console.log(user)
           const file = new Share({
               userId: mongoose.Types.ObjectId(user._id),
               name:req.body.name,
               type:req.body.type,
               url:req.body.url,
           })
           file.save().then(result=>{
            console.log(result.name);
            res.status(200).send({name:result.name});
            
          }
            )
        .catch(err=>{
            console.log(err)
            res.status(400).send(err)});
        }
        else{
            console.log("not found")
            res.sendStatus(404);
        }
    })
})

router.delete('/:id',(req,res)=>{
    Share.findByIdAndDelete(req.params.id,(err,done)=>{
        if(err)
        {
            res.status(400).send(err);
        }
        else{
            res.status(200).send(done);
        }
    })
})





module.exports = router;