var providers = {

		"511" : {
			"protocol"	: "http://",
			"host" 		: "services.my511.org",
			"args"		: {
				"token" : "60ea8299-2a6c-4d7d-bff7-10c3fbad4886"
			},
			"endPoints"	: {
				"GetAgencies" 					: "/Transit2.0/GetAgencies.aspx",
				"GetRoutesForAgency" 			: "/Transit2.0/GetRoutesForAgency.aspx",
				"GetRoutesForAgencies"			: "/Transit2.0/GetRoutesForAgencies.aspx",
				"GetStopsForRoutes"				: "/Transit2.0/GetStopsForRoutes.aspx",
				"GetNextDeparturesByStopCode" 	: "/Transit2.0/GetNextDeparturesByStopCode.aspx"
			}
		},

		"nextBus" : {
			"protocol" 	: "http://",
			"host"		: "webservices.nextbus.com",
			"endPoints"	: {
				"GetAgencies"					: "/service/publicXMLFeed",
				"GetRoutesForAgency" 			: "/service/publicXMLFeed",
				"GetRoutesForAgencies"			: "/service/publicXMLFeed",
				"GetRouteDetails"				: "/service/publicXMLFeed",
				"GetStopsForRoutes"				: "/service/publicXMLFeed",
				"GetNextDeparturesByStopCode" 	: "/service/publicXMLFeed",
			}
		}
	};

module.exports = function (providerId) {	

	return providerId && providers[providerId] ? providers[providerId] : null;

};