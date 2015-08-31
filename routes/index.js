var express 		= require('express');
var router 			= express.Router();
var _ 				= require('underscore');
var mongoose 		= require('mongoose');
var geohash 		= require ('ngeohash');
var request 		= require('request');
var parser 			= require('xml2json');
var apiConfig 		= require('../api/config')('nextBus');
var apiLib			= new (require('../api/lib'))(apiConfig);

router.get('/api/stops/:lat/:lon', function (req, res, next) {
	
	
	var geoId = geohash.encode(req.params.lat, req.params.lon);
	
	geoId = '^' + geoId.substr(0, 6);
	mongoose.model('Stop').find({"geoId" : {"$regex" : geoId}}, function (err, stops) {
		if (err) {
			res.send('There was an error');
			return;
		}

		res.send(stops);
	});
});

router.get('/api/departures/:agency/:route/:stopId', function (req, res, next) {
	var	departuresEndpoint = apiLib.getEndpoint("GetNextDeparturesByStopCode", {command : "predictions", a : req.params.agency, r : req.params.route, s : req.params.stopId});
		apiLib.fetchTransitData(departuresEndpoint, function (error, response, body) {				
			res.json(response);
		});
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Transit Hopper' });
});

module.exports = router;
