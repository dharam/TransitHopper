'use strict';
var _ 			= require ('underscore');
var util 		= require('util');
var geohash 	= require ('ngeohash');
var assert 		= require('assert');

var DBConfig 	= require('./DBConfig');
var mongodb 	= require('mongodb');
var MongoClient = mongodb.MongoClient;

var Stop = function (stop) {
	if (!stop) {
		return;
	}	
	
	this.tag 	= stop.tag;
	this.title 	= stop.title;
	this.lat	= stop.lat;
	this.lon	= stop.lon;
	this.stopId	= stop.stopId;
	this.geoId 	= geohash.encode(this.lat, this.lon);

};

Stop.prototype.getStopInfo = function () {
	return {
			"tag" 	: this.tag,
			"title" : this.title,
			"lat" 	: this.lat,
			"lon" 	: this.lon,
			"geoId" : this.geoId
		};
};

module.exports = Stop;