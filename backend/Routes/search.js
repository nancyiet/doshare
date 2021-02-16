const router = require("express").Router();
const Folder = require("../Models/folder");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');
const File = require("../Models/file");

router.get('/:query',(req,res)=>{
    
})

module.exports=router;