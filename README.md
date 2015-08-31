# Transit Hopper
# Setup
	The db needs to be initialized before using the app. Setup mongodb locally first. Once it is up and running.

	cd <project>
	node daemon/index.js

	This shall initialize the db by creating documents with geohashed stops fetched from the api in the form.

	<code>{ "_id" : ObjectId("55dafa10c85c9af50721d18a"), "tag" : 901480, "title" : "Thornton Av & Newark Blvd", "lat" : 37.5365799, "lon" : -122.03073, "geoId" : "9q9jx17fm" }</code>

	Why?
	The following considerations helped zero in on persisting a part of the data on the app side rather than using public apis.

	1. Rate limiting : Public apis are rate limited. Only essential requests need to be made.

	2. Stable data : The data doesn't change often and can be safely _assumed_ stable for the duration of cache ttls. 

	3. Trivial APIs : The available public APIs are simple and don't allow complex querying. Hence the app business logic has to be done per query. This doesn't *scale* hence creating a hash on app startup simplifies a lot of the logic and improves latency.

	4. Reduced n/w requests : Once the data is stored locally, the app shall still work offline with limited network requests making experience faster.


# App

	The app gets the users current location, geohashes it and sends it across to the server. The server looks up corresponding transit stations and returns that data. 
	
	Using Google Maps api, corresponding markers are setup.

	Clicking on the markers retrieve the latest departure times directly from public apis.
