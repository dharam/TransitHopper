
var TransitHopper = function () {	
	//this.viewPort 	= this.getViewPortSize();
	this.fullBleed(this.getViewPortSize());
	this.user 		= new User(this.mapFactory, this);	
}

TransitHopper.prototype.mapFactory = function (err, position, self) {

	if (err) {
		$('#map').setContent('This browser doesn\'t support location services. Kindly use browsers like Chrome that support location services.');
		return;
	}

	self.parent.map = new Map(self.getLocation(), function (err) {
		if (err) {
			return;
		}

		self.parent.service = new Service(self.parent);
		self.parent.service.getStops(self.parent.user);
	}, self.parent);
}

TransitHopper.prototype.fullBleed = function (sizeObj) {

	var mapRef = document.getElementById('map');	
	$("#map").css({"width" : sizeObj.clientWidth, "height" : sizeObj.clientHeight});

}

TransitHopper.prototype.getViewPortSize = function () {

	return {
		clientWidth : document.documentElement.clientWidth,
		clientHeight : document.documentElement.clientHeight,
	};
}

var User  = function (callback, transitHopper) {
	this.location = {};
	this.parent = transitHopper;

	this.getUserLocation(callback);
};

User.prototype.getUserLocation = function (callback) {	
	var self = this;
	if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {

        	self.setLocation(position, true);
        	callback(null, position, self);        

        }, function (error) {
        	self.errorGettingLocation(error, callback, self);
        });
    }

    return;
}

User.prototype.setLocation = function (position, override) {	
	//Union Square 37.7881 -122.4075
	//Gouge St 37.784283 -122.425022
	//Castro St 37.763048, -122.434334
	//Townsend st 37.771173, -122.405173
	//Oakland webster st 37.799476, -122.270794
	this.latitude 	= override ? 37.799476 : (position && position.coords.latitude);
	this.longitude 	= override ? -122.270794 : (position && position.coords.longitude);
}

User.prototype.getLocation = function () {
	return {latitude : this.latitude, longitude : this.longitude};
}

User.prototype.errorGettingLocation = function (error, callback, self) {	

	switch(error.code) {
        case error.PERMISSION_DENIED:
            userLocationError = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            userLocationError =  "Location information is unavailable."
            break;
        case error.TIMEOUT:
            userLocationError = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            userLocationError = "An unknown error occurred."
            break;
    }

    callback
};


var Map = function (location, callback, parent) {
	var userMarker;
	var userIcon;

	this.parent = parent;

	if (location.latitude && location.longitude) {
		this.latitude 	= location.latitude;
		this.longitude 	= location.longitude;

		this.instance = new google.maps.Map(document.getElementById('map'), {
							center: {
								lat : this.latitude, 
								lng : this.longitude
							},
							zoom: 15
					  	});

		userIcon  = {
			url: '/images/user.png',
			size: new google.maps.Size(71, 71),		  
			scaledSize: new google.maps.Size(25, 25)
		};

		userMarker = new google.maps.Marker({
		    position: {lat: this.latitude, lng: this.longitude},
		    map: this.instance,
		    icon: userIcon
	  	});

		this.parent.infowindow = new google.maps.InfoWindow();

		callback();
	}
}

var Service = function (transitHopper) {
	this.parent = transitHopper;
}

Service.prototype.getStops = function (user) {
	var location = user.getLocation();
	var self = this;

	$.get('/api/stops/' + location.latitude + '/' + location.longitude, function (data, status) {
		var i;
		var busStop;
		var busStopMarker;
		var busIcon;
		
		if (status === 'success') {
			if (data && data instanceof Array) {
				for (i = data.length; i > 0; i--) {
					busStop 		= data[i - 1];
					self.createStopMarkers(busStop);
				}
			}
		}
	});
}

Service.prototype.createStopMarkers = function (busStop) {
	var self = this;
	var busIcon = {
			url 		: '/images/bus-stop.jpg',
			size 		: new google.maps.Size(71, 71),		  
			scaledSize 	: new google.maps.Size(25, 25)
		};

	var busStopMarker = new google.maps.Marker({
							title : busStop.title,
							position: {lat: busStop.lat, lng: busStop.lon},
							map: this.parent.map.instance,
							icon: busIcon
						});
	busStopMarker.addListener('click', function () {
		var infoWindow = self.parent.infowindow;

		infoWindow.setContent('<div class="info"><h3>' + busStop.title + '</h3> <div class="loading-image"></div><ul class="departures"></ul></div>');
		self.sendRequest("departures", [busStop.agencyTag, busStop.routeTag, busStop.tag], self.processDepartures);
		infoWindow.open(self.parent.map.instance, busStopMarker);
	});

}

Service.prototype.sendRequest = function (command, requestParams, callback) {
	var self = this;
	$.get("/api/" + command + "/" + requestParams.join("/"), function (data, status) {
		callback(data, status, self.parent);
	});
}

Service.prototype.processDepartures = function (data, status, parent) {
	
	var departures;
	var direction;
	var predictions;
	var self = this;

	if (status === 'success' && data) {
		data = JSON.parse(data);
		if (data.body && data.body.predictions) {

			predictions = data.body.predictions;
			this.departures = new Departure(predictions, parent);
			this.departures.render();
		}
	}
}

var Departure = function (predictionsObj, parent) {
	
	var i;
	var predictionObj;
	var pred;

	this.parent = parent;

	if (predictionsObj) {
		this.direction 		= predictionsObj.direction;
		this.agencyTitle 	= predictionsObj.agencyTitle;
		this.routeTitle		= predictionsObj.routeTitle;
		this.stopTitle		= predictionsObj.stopTitle;
		this.predictions 	= [];

		if (predictionsObj.direction && predictionsObj.direction.prediction && predictionsObj.direction.prediction instanceof Array) {

			pred = predictionsObj.direction.prediction;

			for (i = 0; i < pred.length; i++) {				
				this.predictions.push({minutes : pred[i].minutes, vehicle : pred[i].vehicle});
			}	
		}
	}
}

Departure.prototype.render = function () {

	var infoWindow = this.parent.infowindow;
	var markup = '';																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																				
	var i;

	for (i = 0; i < this.predictions.length; i++ ) {
		markup += '<li>' + this.predictions[i].vehicle + ' leaving in ' + this.predictions[i].minutes + ' minutes</li>';
	}

	markup = '<div class="info"><h3>' + this.stopTitle + '</h3><h4>' + ((this.direction && this.direction.title) ? this.direction.title : "") + '</h4><ul>' + markup + '</ul>';

	infoWindow.setContent(markup);
}

$(document).ready(function(){
   var transitHopper = new TransitHopper();
});
