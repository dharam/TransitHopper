'use strict';

var _ 		= require('underscore');
var request	= require('request');
var parser 	= require('xml2json');
var apiLib 	= function (config) {
	
	if (!config || !config.protocol || !config.host || !config.endPoints) {
		return;
	}
	
	this.config	= config;

};

apiLib.prototype.getEndpoint = function (type, args) {

	var config 	= this.config,
		qparams	= this.getQueryParams(args);
	
	return config.protocol + config.host + config.endPoints[type] + '?' + qparams;
};

apiLib.prototype.checkResponse = function (error, response, body) {
	var json;

	if (!error && response.statusCode === 200) {		
		json = parser.toJson(body);		
		return json;
	}
};

apiLib.prototype.fetchTransitData = function (endPoint, callback) {
	var self = this;

	request(endPoint, function (error, response, body) {
		var resp = self.checkResponse(error, response, body);
		if (resp) {
			return callback(null, resp, body);
		}

		callback(error, 'There was an error');
	});
};

apiLib.prototype.processResponse = function (response) {
	try {
		var json = JSON.parse(response);
		return json;
	} catch (e) {		
		return;
	}		
};

apiLib.prototype.getQueryParams = function (args) {
	var config = this.config,
		qparams = [];

	args = (args) ? args : {};

	//Merge the config args and the parameter args	
	_.extend(args, (config && config.args ? config.args : {}));
	
	_.each(_.keys(args), function (element) {		
		qparams.push(element + '=' + this[element]);
	}, args);

	return qparams.join('&');
};

module.exports = apiLib;
