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

var infocontents;

var service;
var marker;

var entry;
var restaurant_exists;
var appointment_exists;

var green = "green";
var red = "red";
var yellow = "yellow";


//@TODO: check for and preserve markers for existing appointments during clear
//@TODO: clear at each new instance of place search


function clearMarkers() {

    var exempt = false;
    // Clear out the old markers.

    markers.forEach(function(marker) {
        appointments.forEach(function(appointment) {
            if(_.isEqual(marker.title, appointment.title)) {
                exempt = true;
            }
        });
        if(!exempt) {
 
            var index = markers.indexOf(marker);
 
            if (index > -1) {
                markers.splice(index, 1);
            }
        }       
    });
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
        mapTypeId: 'roadmap'
    });

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

    markers = [];

    searchBox.addListener('places_changed', function() {

        clearMarkers();

        places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
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
            
            search(new_restaurant, false);
          }

          setIcons(); 

      });
      location.reload();
  });
}

function setIcon(restaurant, color) {

    icon = {
        url: "http://maps.google.com/mapfiles/ms/icons/" + color + "-dot.png",
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
    };

    var position = restaurant.position;

    // Create a marker for a place.
 
    markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: restaurant.name,
        position: position
    }));
}

function setIcons() { 
    restaurants.forEach(function(restaurant) {

        //@TODO: conditional statemenet to  set icon red/yellow/green based on appointment status

        appointment_exists = false;

        appointments.forEach(function(appointment) {

            if (_.isEqual(appointment.address, restaurant.address)) {
 
                setIcon(restaurant, green);
                appointment_exists  = true;
            }
        });
        
        if (!appointment_exists) {

            setIcon(restaurant, red);

        }
 
        markers.forEach(function(marker) {

            var infowindow = new google.maps.InfoWindow();
            var marker_position = marker.getPosition().toJSON();

            //@TODO: conditional, if in appointments infocontents = item, else form

            google.maps.event.addListener(marker, 'click', function() {

                var appointmentMarker = false;

                appointments.forEach(function(appointment) {

                    if (_.isEqual(appointment.address, restaurant.address) && _.isEqual(restaurant.position, marker_position)) {
        
                        infocontents = '<br><div><p><strong><big><b>' + appointment.title + '</b></big></strong></p><br><p><span class="info">Date: </span>' + appointment.date + '</p><p><span class="info">Start time: </span>' + appointment.starttime + '</p><p><span class="info">End time: </span>' + appointment.endtime + '</p><p><span class="info">Notes: </span><br><span class="notes">' + appointment.notes + '</span></p></div>'

                        appointmentMarker = true;
                    }
                });

                if(!appointmentMarker) {
                    infocontents = '<form id="add_item_form"><div class="form-group"><input id="id" class="form-control" type="hidden" value="' + restaurant.id + '"></div><div class="form-group"><label for="title">Place:</label><input id="title" class="form-control" type="text" aria-describedby="titleHelp" placeholder="' + restaurant.title + '"  value="' + restaurant.title + '" minlength="2" readonly></div><div class="form-group"><label for="date">Date:</label><input id="date" class="form-control" type="text" aria-describedby="dateHelp" placeholder="mm/dd/yyyy" required><small id="dateHelp" class="form-text text-muted">Please enter the date in the specified format.</small></div><div class="form-group"><label for="starttime">Start time:</label><input id="starttime" class="form-control time" type="time" aria-describedby="starttimeHelp" placeholder="h:mm p" required><small id="starttimeHelp" class="form-text text-muted">Please enter the start time in the specified format.</small></div><div class="form-group"><label for="endtime">End time:</label><input id="endtime" class="form-control time" type="time" aria-describedby="endtimeHelp" placeholder="h:mm p" required><small id="endtimeHelp" class="form-text text-muted">Please enter the end time in the specified format.</small></div><div class="form-group"><label for="textareaNotes">Notes:</label><textarea class="form-control" id="textareaSummary" rows="3"></textarea></div><input id="submit" type="submit" class="btn btn-primary mb-5" value="Submit"></form>'
                } 

                infowindow.setContent(infocontents);
                
                if(_.isEqual(restaurant.position, marker_position)) {

                    google.maps.event.addListener(infowindow, 'domready', function() {

                    // Bind the click event on your button here

                    $('#submit').on('click', function(e){

                        e.preventDefault();

                        var id = $('input#id').val()
                        var title = $('input#title').val()
                        var date = $('input#date').val()
                        var starttime = $('input#starttime').val()
                        var endtime = $('input#endtime').val()
                        var notes = $.trim($('textarea#textareaNoes').val()).replace(/\"/g, "\\\"")
                        var address =  restaurant.address

                        var newItem = jQuery.parseJSON( '{ "id": "' + id + '", "title": "' + title + '", "date": "' + date + '", "starttime": "' + starttime + '",  "endtime": "' + endtime + '", "notes": "' + notes + '", "address": "' + address + '" }')
                        
                        search(newItem, true)
                    });
                });

                infowindow.open(map, this);

                }               
            });
        });
    });
}

$(document).ready(function(){


    $('#search-discover-input').attr("placeholder","Enter search...");
    setIcons();

    $( "#date" ).datepicker();
    $(".time").timepicker({
        timeFormat: 'h:mm p',
        interval: 30,
        minTime: '6:00am',
        maxTime: '11:30pm',
        defaultTime: '12:00pm',
        startTime: '6:00am',
        dynamic: false,
        dropdown: true,
        scrollbar: true
    });
});


