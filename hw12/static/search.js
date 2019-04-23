//@TODO: limit search  space  to type:  restaurants,  food


var columbia;
var map;
var radius;
var request;
var keyword;

var input;
var searchBox;
var markers;

var places;

var bounds;
var icon;

var request;
var infowindow;
var infocontents;

var service;
var marker;

var entry;
var exists;

function clearMarkers() {

    // Clear out the old markers.

    markers.forEach(function(marker) {
        marker.setMap(null);
    });

    markers = [];
}

var search = function(newItem){
    var item_to_add = newItem
    $.ajax({
        type: "POST",
        url: "search",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(item_to_add),
        success: function(result){
            console.log(result);
            var all_search_results = result["restaurants"]
            console.log(all_search_results);
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

function initMap() {
    columbia = new google.maps.LatLng(40.8070, -73.9630);
    map = new google.maps.Map(document.getElementById('map'), {
        center: columbia,
        zoom: 16,
        mapTypeId: 'roadmap'
    });

    // Create the search box and link it to the UI element.

    input = document.getElementById('search-discover-input');
    searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.

    map.addListener('bounds_changed', function() {
           searchBox.setBounds(map.getBounds());
    });

    markers = [];

    searchBox.addListener('places_changed', function() {
        places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }

       // For each place, get the icon, name and location.

       bounds = new google.maps.LatLngBounds();
       places.forEach(function(place) {

          if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
          }

          exists = false;

          restaurants.forEach(function(restaurant) {

              if (restaurant.id == place.id) {
                  exists = true;
              }
          });

          if (!exists) { 
              entry = {
              title: place.name,
              id: place.id,
              address: place.formatted_address
              } 
              search(entry);
          }

          //@TODO:  Store the icons


          icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
          };

          //@TODO Store the position: place.geometry.location with the restuarant attributes for  use  here
          //@TODO Create markers separately from initMap function,  based on restaurants array in server

          // Create a marker for each place.
 
          markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
          }));
       
           
 
          markers.forEach(function(marker) {

              infowindow = new google.maps.InfoWindow();

              google.maps.event.addListener(marker, 'click', function() {
          
 
                   

                  infocontents = "";
                  infowindow.setContent(infocontents);
                  infowindow.open(map, this);
              });
          });
      });
      location.reload();
  });
}

$(document).ready(function(){


    $('#search-discover-input').attr("placeholder","Enter search...");

});

