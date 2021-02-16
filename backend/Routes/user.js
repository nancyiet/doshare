const router = require("express").Router();
const User = require("../Models/user");
const Folder = require("../Models/folder");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();


//post
router.post("/",jsonParser,(req,res)=>{
     console.log("reached")
    User.findOne({email:req.body.email}).exec((err,found)=>{
       
        if(err)
        {
           console.log(err);
            res.status(401).send(err);
        }
         else if(!found)
        {
           
            const user = new User({
                name:req.body.name,
                email:req.body.email,
                photoUrl:req.body.photo,
                homeId:"",
            });
            user.save((err)=>{
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log(user);
                  
                        const folder = new Folder({
                            userId:user._id,
                            name:`home-${user._id}`,
                           
                        })
                        folder.save().then(fd=>{
                            console.log(fd)
                            User.findByIdAndUpdate({_id:user._id},{$set:{homeId:fd._id}},{new:true},(err,result)=>{
                                if(!err)
                                {
                                    console.log(result);
                                    res.status(200).send(result);
                                }
                                else{
                                    res.status(401).send(err);
                                }
                            })
                           
                        })
                        .catch(err=>console.log(err));
                  
                  
                      
                }
            });
        }
        else
        {
           console.log("found");
            res.status(200).send(found);
        }
    })
   
})
//Get

router.get('/',(req,res)=>{
      
     User.find({},(err,user)=>{
         if(!err)
         {
             res.status(200).send(user);
         }
         else{
             res.status(401).send(err)
         }
     })
})

module.exports = router;