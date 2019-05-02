//@TODO: form validation for infowindow, do not allow old dates, specify 

var map;
var radius;
var request;
var keyword;

var input;
var searchBox;
var markers = [];

var places;

var bounds;

var request;

var service;
var marker;

var entry;
var restaurant_exists;
var appointment_exists;

var green = "green";
var red = "red";
var yellow = "yellow";

var restaurants = [];


//@TODO: check for and preserve markers for existing appointments during clear
//@TODO: clear at each new instance of place search


function reset(){


}

function search(newItem, appointment){
    var item_to_add = newItem
    $.ajax({
        type: "POST",
        url: "search?appointment=" + appointment,                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(item_to_add),
        success: function(result){
            console.log(result);
            location.reload();
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
        mapTypeId: 'roadmap',
        fullscreenControl: true,
        fullscreenControlOptions: {
              position: google.maps.ControlPosition.RIGHT_CENTER
        }
    });

    appointments.forEach(function(appointment){
        restaurants.push(appointment)
    });


    initMarkers()

   
    var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(40.819684, -73.933929),
        new google.maps.LatLng(40.800294, -73.974440));

    // Create the search box and link it to the UI element.

    input = document.getElementById('search-discover-input');
    searchBox = new google.maps.places.SearchBox(input, {
        bounds: defaultBounds,
        types: ['(restaurants)'],
    });
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.

    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', function() {


        places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }

        if (places.length > 10) {
            places = (searchBox.getPlaces()).slice(0, 4);
        }



        // For each place, get the icon, name and location.

        places.forEach(function(place) {

            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }

            restaurant_exists = false;

            restaurants.forEach(function(restaurant) {

                if (_.isEqual(restaurant.address, place.address)) {
                    restaurant_exists = true;
                }
            });

            if (!restaurant_exists) { 
                new_restaurant = {
                title: place.name,
                id: place.id,
                address: place.formatted_address,
                icon: place.icon,
                position: place.geometry.location
                } 
            
                restaurants.push(new_restaurant);

            }


        });
        initMarkers(); 
    });
}



function initMarkers() {


    restaurants.forEach(function(restaurant) {

        var address = restaurant.address

        var geocoder = new google.maps.Geocoder();

        var infowindow = new google.maps.InfoWindow({ maxWidth: 200 });

        var appointmentMarker = false;

        var infocontents;

        var icon;


            appointments.forEach(function(appointment) {

                if (_.isEqual(appointment.address, restaurant.address)) {

                    appointmentMarker = true;

                    icon = {
                        url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(25, 25)
                    };

                    infocontents = '<br><div><p><strong><big><b>' + appointment.title + '</b></big></strong></p><br><p><span class="info">Address: </span>' + appointment.address + '</p><p><span class="info">Date: </span>' + appointment.date + '</p><p><span class="info">Start time: </span>' + appointment.starttime + '</p><p><span class="info">End time: </span>' + appointment.endtime + '</p><p><span class="info">Notes: </span><br><br>' + appointment.notes + '</p></div>'
                }
            });

            if(!appointmentMarker) {

                icon = {
                        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(25, 25)
                    }; 

                infocontents = '<form id="add_item_form"><div class="form-group"><input id="id" class="form-control" type="hidden" value="' + restaurant.id + '"></div><div class="form-group"><label for="title">Place:</label><input id="title" class="form-control" type="text" area-describedby="titleHelp" placeholder="' + restaurant.title + '"  value="' + restaurant.title + '" minlength="2" readonly></div><div class="form-group"><label for="address">Address:</label><input id="address" class="form-control" type="text" area-describedby="addressHelp" placeholder="' + restaurant.address + '"  value="' + restaurant.address + '" minlength="2" readonly></div><div class="form-group"><label for="date">Date:</label><input id="date" class="form-control" type="text" aria-describedby="dateHelp" placeholder="yyyy-mm-dd" required><small id="dateHelp" class="form-text text-muted">Please enter the date in the specified format.</small></div><div class="form-group"><label for="starttime">Start time:</label><input id="starttime" class="form-control time" type="time" aria-describedby="starttimeHelp" placeholder="hh:mm" required><small id="starttimeHelp" class="form-text text-muted">Please enter the start time in the specified format.</small></div><div class="form-group"><label for="endtime">End time:</label><input id="endtime" class="form-control time" type="time" aria-describedby="endtimeHelp" placeholder="hh:mm" required><small id="endtimeHelp" class="form-text text-muted">Please enter the end time in the specified format.</small></div><div class="form-group"><label for="textareaNotes">Notes:</label><textarea class="form-control" id="textareaNotes" rows="3"></textarea></div><input id="submit" type="submit" class="btn btn-secondary mb-5" value="Submit"></form>'

            }

            geocoder.geocode( { 'address': address}, function(results, status) {

            if (status == 'OK') {

                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                    icon: icon
                });
                
                markers.push(marker);

                google.maps.event.addListener(marker, 'click', function() {

                    infowindow.setContent(infocontents);

                    console.log(_.isEqual(restaurant.position, marker.position))

                            google.maps.event.addListener(infowindow, 'domready', function() {

                            // Bind the click event on your button here

                                $('#submit').on('click', function(e){

                                    e.preventDefault();

                                    var id = $('input#id').val()
                                    var title = $('input#title').val()
                                    var date = $('input#date').val()
                                    var starttime = $('input#starttime').val()
                                    var endtime = $('input#endtime').val()
                                    var notes = $.trim($('textarea#textareaNotes').val()).replace(/\"/g, "\\\"")
                                    var address =  restaurant.address
                                    var position = restaurant.position

                                    var newItem = jQuery.parseJSON( '{ "id": "' + id + '", "title": "' + title + '", "date": "' + date + '", "starttime": "' + starttime + '",  "endtime": "' + endtime + '", "notes": "' + notes + '", "address": "' + address + '", "position": "' + position + '" }')
                        
                                    search(newItem, true)
                                });
                            });

                    infowindow.open(map, this);
                });
            } 
            else {

                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    });
}


function setIconColor(restaurant, color) {

    icon = {
        url: "http://maps.google.com/mapfiles/ms/icons/" +color + "-dot.png",
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
    };


}



$(document).ready(function(){


    $('#search-discover-input').attr("placeholder","Restaurant name or street address");

});


