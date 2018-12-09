function createMap() {

  var position = {lat: 0.3476, lng: 32.5825};
	var mapProperties = {
		center: position,
		zoom: 7,
	};
  
  var map = new google.maps.Map(document.getElementById("map"), mapProperties);

  var marker = new google.maps.Marker({
    position: position,
    map: map,
    title: 'Marker'
  });
}

