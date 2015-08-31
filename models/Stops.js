var mongoose = require('mongoose');  
var stopSchema = new mongoose.Schema({	
	tag: String,
	routeTag : String,
	title: String,
	lat: Number,
	lon: Number,
	geoId : String,
	agencyTag : String
});

mongoose.model('Stop', stopSchema);