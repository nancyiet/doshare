require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/user");
const storeRoute = require("./Routes/store");
const url = process.env.MONGOURL;

app.use(bodyParser.urlencoded({ extended: false }))
const port = 3000;

app.use(cors())
app.use(express.json())
app.use(express.static('public'))


mongoose.connect(url,({useCreateIndex:true,useFindAndModify:false,useNewUrlParser:true,
useUnifiedTopology:true,}));

const connection = mongoose.connection;
connection.once('open',()=>{
    
    console.log("mongoose connected successfully");})


//routes

app.use("/user",userRoute);
app.use("/store",storeRoute);




app.listen(port,()=>console.log("server has been started"));