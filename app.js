require('dotenv').config();

var mongoose	    = require('mongoose');
var bodyParser = require('body-parser')
var express = require("express");
var app = express();



// // Mongoose SetUp
// mongoose.connect('mongodb://localhost:27017/weather', {
// 	useNewUrlParser: true,
// 	useCreateIndex: true,
// 	useUnifiedTopology: true
// });


// app SetUp
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/js"));
app.use(express.static(__dirname + "/json"));
app.use(express.static(__dirname + "/img"));
app.set("view engine", "ejs");

// google maps
var NodeGeocoder = require('node-geocoder')
 var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
var geocoder = NodeGeocoder(options);
// gm
 

// // SCHEMA SETUP
// var placeSchema = new mongoose.Schema({
// 	//google maps
//    location: String,
//    lat: Number,
//    lng: Number,	
// });
// var Place = mongoose.model('Place', placeSchema);



// GET
app.get("/", function(req, res){
	res.render("index");
}); 


// POST
app.get("/", function(req, res){
	
	geocoder.geocode(req.body.location, function (err, data) {
		if (err || !data.length) {
			console.log(err);
		  req.flash('error', 'Invalid address');
		  return res.redirect('back');
		}
		var lat = data[0].latitude;
		var lng = data[0].longitude;
		var location = data[0].formattedAddress;
		var Place = {location: location, lat: lat, lng: lng};
		console.log(Place);
}); 
	res.redirect("/", { place: Place});
});



// //CREATE
// app.post('/', function(req, res) {
// 	// get data from form and add to campgrounds array
// 	var loc = req.body.location;
// 	geocoder.geocode(req.body.location, function (err, data) {
// 		if (err || !data.length) {
// 			console.log(err);
// 		  req.flash('error', 'Invalid address');
// 		  return res.redirect('back');
// 		}
// 		var lat = data[0].latitude;
// 		var lng = data[0].longitude;
// 		var location = data[0].formattedAddress;
// 		var place = {location: location, lat: lat, lng: lng};
// // Create a new campground and save to DB
// 	Place.create(newPlace, function(err, newlyCreated) {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			//redirect back to campgrounds page
// 			req.flash("success", "The Place was created");
// 			res.redirect('/');
// 		}
// 		});
// 	});
// });



//// LISTENER
app.listen(process.env.PORT || 3000, function() {
    console.log("Weather is on ...");
});