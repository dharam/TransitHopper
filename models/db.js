var mongoose = require('mongoose');
var dbConfig = require('../api/DBConfig');

var dbURL = process.env.TRANSITHOPPER_MONGODB_DB_URL ? (process.env.TRANSITHOPPER_MONGODB_DB_URL + '/' + dbConfig.name) : '';

if (!dbURL) {
	dbURL = dbConfig.protocol + '://' + (process.env.OPENSHIFT_MONGODB_DB_HOST || dbConfig.host) + ':' + (process.env.OPENSHIFT_MONGODB_DB_PORT || dbConfig.port) + '/' +  dbConfig.name;
}
console.log('>>>>'+dbURL);
mongoose.connect(dbURL);