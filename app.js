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
mongoose.connect("mongodb://localhost:27017/healthDB", {useNewUrlParser : true,useUnifiedTopology: true});

mongoose.set('useFindAndModify', false);

const healthschema = {
    title: String ,
    location_lat1 : String ,
    location_lon1 : String ,
    location_lat2 : String ,
    location_lon2 : String
}

const Health = mongoose.model("Health" , healthschema);

app.post("/api-a" ,function(req ,res){
    console.log(req.body);
    const data = req.body;
    res.json({
        latitude : data.lat_a, 
        longitude : data.lon_a
    });
    const lat = req.body.lat_a;
    const lon = req.body.lon_a;
    Health.findOneAndUpdate(
        {title: "location"},
        {$set : { location_lat2: lat }},
        function(err){
            if(!err){
                console.log("successfully updated");
            }
            else{
                console.log("unsuccessful");
            }
        }
    );
    Health.findOneAndUpdate(
        {title: "location"},
        {$set : { location_lon2: lon }},
        function(err){
            if(!err){
                console.log("successfully updated");
            }
            else{
                console.log("unsuccessful");
            }
        }
    );

});
app.post("/api" ,function(req ,res){
    console.log(req.body);
    const data = req.body;
    res.json({
        latitude : data.lat, 
        longitude : data.lon
    });
    const lat = req.body.lat;
    const lon = req.body.lon;
    const newhealth = new Health ({
        title: "location",
        location_lat1 : lat,
        location_lon1 : lon,
        location_lat2: "0",
        location_lon2:"0"
    });
    newhealth.save();
});

app.get("/auth",function(req ,res){
    res.render("auth");
});

app.post("/newloc",function(req,res){
    res.redirect("/auth");
});

app.get("/newloc",function(req ,res){
    res.render("loc_aft");
});

app.post("/prevloc",function(req,res){
    res.redirect("/newloc");
});

app.get("/prevloc",function(req ,res){
    res.render("loc_prev");
});

app.post("/",function(req,res){
    res.redirect("/prevloc");
});

app.get("/",function(req,res){
    res.render("front");
})

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
  });