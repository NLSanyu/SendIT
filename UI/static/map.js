var map;
var marker;
var markers = [];

function createMap() {
  var position = {lat: 0.3476, lng: 32.5825};
	var mapProperties = {
		center: position,
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.ROADMAP
	};
  
  map = new google.maps.Map(document.getElementById("map"), mapProperties);

  marker = new google.maps.Marker({
    position: position,
    map: map,
    title: 'Marker'
  });

  marker.setMap(map);

  google.maps.event.addListener(marker, "click", function (event) {
    document.getElementById("map-pickup").value = this.position;
    document.getElementById("map-dest").value = this.position;
  }); 

  map.addListener('click', function(event) {
    addMarker(event.latLng);
  });

}

function addMarker(location) {
  marker = new google.maps.Marker({
    position: location,
    map: map
  });
  markers.push(marker);
}

function searchPlaces(place){
    var input = document.getElementById(place);
    new google.maps.places.Autocomplete(input);
}





