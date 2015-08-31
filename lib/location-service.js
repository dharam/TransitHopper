
(function () {
	var locationService = {		
		getLocation : function () {
			var self = this;

		    if (navigator.geolocation) {
		        navigator.geolocation.getCurrentPosition(function (position) {
		        	console.log(position);			    	
			    	initialize('37.7881', '-122.4075');
		        });

		    } else {
		    	console.log("Geolocation is not supported by this browser.");
		    	return false; 		        
		    }
		}
	}

	var map;
      var infowindow;
      var service ;
      function initialize(lat,lng) 
      {
        var origin = new google.maps.LatLng(lat,lng);
       
        map = new google.maps.Map(document.getElementById('map'), {
          mapTypeId: google.maps.MapTypeId.HYBRID,
          center: origin,
          zoom: 15
        });
        
        var request = {
          location: origin,
          radius: 2500,
          types: ['train_station','bus_station','subway_station','transit_station']
        };
        infowindow = new google.maps.InfoWindow();
        service = new google.maps.places.PlacesService(map);
        service.search(request, callback);
      }

      function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
      }

      function createMarker(place) {
      
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });
        console.log(place);
        var content='<strong style="font-size:1.2em">'+place.name+'</strong>'+
                    '<br/><strong>Latitude:</strong>'+placeLoc.lat()+
                    '<br/><strong>Longitude:</strong>'+placeLoc.lng()+
                    '<br/><strong>Type:</strong>'+place.types[0]+
                    '<br/><strong>Rating:</strong>'+(place.rating||'n/a');
        var more_content='<img src="http://googleio2009-map.googlecode.com/svn-history/r2/trunk/app/images/loading.gif"/>';
        
        //make a request for further details
        service.getDetails({reference:place.reference}, function (place, status) 
            {
              if (status === google.maps.places.PlacesServiceStatus.OK) 
              {
                more_content='<hr/><strong><a href="'+place.url+'" target="details">Details</a>';
                
                if(place.website)
                {
                  more_content+='<br/><br/><strong><a href="'+place.website+'" target="details">'+place.website+'</a>';
                }
              }
            });


        google.maps.event.addListener(marker, 'click', function() {
          
          infowindow.setContent(content+more_content);
          infowindow.open(map, this);
        });
      }

      window.addEventListener('load', function(){
      	console.log('>>>>>>');
      	var location = locationService.getLocation();
      });
})();