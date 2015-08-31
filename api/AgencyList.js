'use strict';
var request 		= require('request');
var events		= require('events');
var util 		= require("util");
var _ 			= require('underscore');
var parser 		= require('xml2json');

var apiConfig 		= require('./config')('nextBus');
var apiLib		= new (require('./lib'))(apiConfig);
var Route 		= require('./Route');

var AgencyList = function (agencyList) {
	
	if (!agencyList || !_.isArray(agencyList)) {
		return;
	}
	events.EventEmitter.call(this);	
	
	//Initialize the list object
	this.agencies = {};

	this.routes = {};	

	_.each(agencyList, function (agency) {
	
		if (!agency)	{
			return;
		}
		
		this.agencies[agency.tag] = agency;

	}, this);
};

util.inherits(AgencyList, events.EventEmitter);

AgencyList.prototype.getAgencyNames = function () {
	
	return _.keys(this.agencies);
};

AgencyList.prototype.getRouteList = function () {
	var routes = {};	

	//Not using async to avoid rate limiting on the api
	this.getRoutes(0);	
};

AgencyList.prototype.getRoutes = function (index) {	
	var agencyNames = this.getAgencyNames();
	var self = this;
	var allAgencyRoutesEndpoint;
	
	//records for 2 agencies run to 8k, for 50 agencies rate limiting
	if (index >= 2 ) { //agencyNames.length) {
		this.emit("routeList:loaded", this);		
		return this.saveToFile();		
	}
	if (!agencyNames[index]) {
		self.getRoutes(++index);
		return;
	}

	allAgencyRoutesEndpoint = apiLib.getEndpoint("GetRoutesForAgency", {command : "routeList", a : agencyNames[index]});
	
	apiLib.fetchTransitData(allAgencyRoutesEndpoint, function (error, response, body) {
		var validResponse;
		var jsonResponse;
		var routeName 	= agencyNames[index];		
		jsonResponse 	= apiLib.processResponse(response);		

		if (routeName) {
			self.addRouteInfo(agencyNames[index], jsonResponse);		
			self.getRoutes(++index);
		}
	});	
};

AgencyList.prototype.addRouteInfo = function (agencyTag, infoObj) {	
	this.agencies[agencyTag].routes = (infoObj && infoObj.body && infoObj.body.route) ? infoObj.body.route : {};
};

AgencyList.prototype.getRouteDetails = function () {	
	_.each(this.agencies, function (agency) {		
		_.each(agency.routes, function (route) {			
			this.fetchRouteDetails(0, agency.tag, route.tag);
		}, this);
	}, this);
};

AgencyList.prototype.fetchRouteDetails = function (index, agencyTag, routeTag) {
	var self = this;
	var routeDetailsEndpoint = apiLib.getEndpoint("GetRouteDetails", {command : "routeConfig", a : agencyTag, r : routeTag, terse : 1});
	
	apiLib.fetchTransitData(routeDetailsEndpoint, function (error, response, body) {

		var jsonResponse;		
	 	var routeInfo = apiLib.processResponse(response);
	 	
	 	if (routeInfo && routeInfo.body && routeInfo.body.route) {
	 		if (self.agencies && !self.routes[agencyTag]) {
	 			self.routes[agencyTag] = {};
	 		}	 	 			
 			self.routes[agencyTag][routeTag] = new Route(routeInfo.body.route, agencyTag);	 		
	 	}
	});
};

AgencyList.prototype.saveToFile = function () {
	
};

module.exports = AgencyList;
