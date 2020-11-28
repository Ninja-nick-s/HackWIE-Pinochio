const express = require("express");
// const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { response, request } = require("express");
const app = express();

app.use(express.static("public"));
app.use(express.json({limit:'1mb'}));

app.set('view engine', 'ejs');

// app.use(bodyParser.urlencoded({
//   extended: true
// }));
//mongoose.connect("mongodb://localhost:27017/DBname", {useNewUrlParser : true,useUnifiedTopology: true});
app.get("/",function(req,res){
    res.render("front");
})

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
  });