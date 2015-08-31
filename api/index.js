'use strict';
var request 		= require('request');
var async 			= require('async');
var parser 			= require('xml2json');
var apiConfig 		= require('./config')('nextBus');
var apiLib			= new (require('./lib'))(apiConfig);
var AgencyList 		= require('./AgencyList');

var api = function (req, res) {
	async.waterfall([

		function (callback) {
			var	allAgenciesEndPoint = apiLib.getEndpoint("GetAgencies", {command : "agencyList"});
			apiLib.fetchTransitData(allAgenciesEndPoint, callback);
		},

		function (agenciesResponse, body, callback) {
			
			var agencyList;			
			var processResponse = apiLib.processResponse(agenciesResponse);
			
			if (!processResponse || !processResponse.body || !processResponse.body.agency) {
				callback(true, {});
			}
			
			agencyList 	= new AgencyList(processResponse.body.agency);

			agencyList.on('routeList:loaded', function (agencyList) {				
				callback(null, agencyList);
			});

			agencyList.getRouteList();			
		},

		function (agencyList) {								
			agencyList.getRouteDetails();			
		}]);
};

module.exports = api;
