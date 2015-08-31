'use strict';
var _ 		= require('underscore');
var Stop 	= require('./stop');
var TransitDB = require ('./TransitDB');
var mongoose 	= require('mongoose');
var db			= require('../models/db');
var Stops		= require('../models/Stops');

var Route = function (routeInfo, agencyTag) {
	var transitDB;
	var self = this;
	if (!routeInfo) {
		return;
	}

	this.tag 	= routeInfo.tag;
	this.title 	= routeInfo.title;
	this.latMin	= routeInfo.latMin;
	this.latMax	= routeInfo.latMax;
	this.agencyTag = agencyTag;
	this.stops	= [];
	
	if (routeInfo.stop) {

		_.each(routeInfo.stop, function (stopInfo) {			
			var stop = new Stop(stopInfo);
			stop = stop.getStopInfo(); 
			//this.stops.push(stopInfo.getStopInfo());
			console.log(stop.tag + '>' + stop.title + '>' + stop.lat + '>' +stop.lon + '>' +stop.geoId);
			mongoose.model('Stop').create({
				tag : stop.tag,
				routeTag : routeInfo.tag,
				title : stop.title,
				lat : stop.lat,
				lon : stop.lon,
				geoId : stop.geoId,
				agencyTag : agencyTag
			});
		}, this);



		/**transitDB = new TransitDB('routes', this.stops, function (err, result) {
			if (err) {
				console.log('Error saving result');
				return;
			}
			console.log('Data saved successfully for ' + self.tag);
			return;
		});	*/	
	}
};

module.exports = Route;