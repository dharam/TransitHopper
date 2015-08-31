'use strict';
var mongodb 	= require('mongodb');
var MongoClient = mongodb.MongoClient;
var DBConfig 	= require('./DBConfig');

var TransitDB = function (collection, data, cb) {		
	// Connection URL. This is where your mongodb server is running.
	var url = DBConfig.protocol + '://' + DBConfig.host + ':' + DBConfig.port + '/' +  DBConfig.name;	
	var self = this;
	
	MongoClient.connect(url, function (err, db) {
		
		self.collection = db.collection(collection);
		self.save(data, cb);
	});
};

TransitDB.prototype.save = function (data, cb) {
	
	this.collection.insert(data, function (err, result) {
		if (err) {
			console.log('There was an error inserting data');
			cb(err);
			return;
		}		
		cb(err, result);
	
	});
};

module.exports = TransitDB;
