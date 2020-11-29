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

function findDistance(lat1,lat2,lon1,lon2) {
    var R = 6371e3; // R is earth’s radius
    var lat1radians = toRadians(lat1);
    var lat2radians = toRadians(lat2);
 
    var latRadians = toRadians(lat2-lat1);
    var lonRadians = toRadians(lon2-lon1);
 
    var a = Math.sin(latRadians/2) * Math.sin(latRadians/2) +
         Math.cos(lat1radians) * Math.cos(lat2radians) *
         Math.sin(lonRadians/2) * Math.sin(lonRadians/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
 
    var d = R * c;
    
    return d ;
 }
 function toRadians(val){
    var PI = 3.1415926535;
    return val / 180.0 * PI;
}


app.get("/decoy",function(req ,res){

    res.render("decoy");
});


app.post("/auth",function(req,res){
    Health.findOne({'title':'location'}, 'location_lat1 location_lon1 location_lat2 location_lon2 _id', function (err, person) {
        if (err) console.log(err);
        var lat1=parseFloat(person.location_lat1) ;
        var lon1= parseFloat(person.location_lon1);
        var lat2=parseFloat(person.location_lat2) ;
        var lon2= parseFloat(person.location_lon2);
        var id= person._id;
        console.log(id);
        // console.log(lat1);
        // console.log(lon1);
        // console.log(lat2);
        // console.log(lon2);
        var distance = findDistance(lat1,lat2,lon1,lon2);
        console.log(distance);
        var calories=0 ;
        var calories = calories + distance*0.04 ;
        var threshold = 0 ;
        if(calories >= threshold){
            res.redirect("/decoy");
        }
        else{
            res.redirect("/newloc");
        }

      });
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
    Health.findOneAndUpdate(
        {title: "location"},
        {$set : { location_lat1: lat }},
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
        {$set : { location_lon1: lon }},
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
app.post("/prevloc",function(req,res){
    res.redirect("/newloc");
});

app.get("/prevloc",function(req ,res){
    res.render("loc_prev");
});
app.post("/delete" ,function(req ,res){
    Health.deleteMany(function(err){
        if(!err){
            console.log("deleted location");
        }
        else
        {
            console.log(err);
        }
    });
    res.redirect("/");
});

app.post("/",function(req,res){
    const newhealth = new Health ({
        title: "location",
        location_lat1 : "0",
        location_lon1 : "0",
        location_lat2: "0",
        location_lon2:"0"
    });
    newhealth.save();
    res.redirect("/prevloc");
});

app.get("/",function(req ,res){
    res.render("front");
});


app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
  });