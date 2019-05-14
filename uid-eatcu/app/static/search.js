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


function search(newItem, appointment){
    var item_to_add = newItem
    $.ajax({
        type: "POST",
        url: "search?appointment=" + appointment,                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(item_to_add),
        success: function(result){
            alertEventCreated(item_to_add.title);
            console.log(result);
            $('body').fadeOut(500, function(){
                location.reload(1);
            });
        },
        error: function(request, status, error){
            alertOops()
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
        zoom: 15,
        mapTypeId: 'roadmap',
        fullscreenControl: true,
        fullscreenControlOptions: {
              position: google.maps.ControlPosition.RIGHT_CENTER
        }
    });

    pending.forEach(function(pendingEvent){
        restaurants.push(pendingEvent)
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

        bounds = new google.maps.LatLngBounds();

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

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }

        });
        initMarkers(); 
        map.fitBounds(bounds);
    });
}


function initMarkers() {


    restaurants.forEach(function(restaurant) {

        var address = restaurant.address

        var geocoder = new google.maps.Geocoder();

        var infowindow = new google.maps.InfoWindow({ maxWidth: 200 });

        var appointmentMarker = false;

        var pendingMarker = false;

        var infocontents;

        var icon;

        console.log(restaurants)

        appointments.forEach(function(appointment) {

            if (_.isEqual(appointment.address, restaurant.address)) {

                appointmentMarker = true;

                icon = {
                    url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                    size: new google.maps.Size(50, 50),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(32, 32)
                };

                users.forEach(function(user){

                    if (_.isEqual(user_id, user.user_id)) {

                         infocontents = '<br><div class="pl-2"><b><span class="info-window">Your  event:</span></b><br><p><strong><big><b><span class="title-window">' + appointment.title + '</span></b></big></strong><br><small><span class="title-help">' + appointment.address + '</span></small></p><p><span class="info-window"><small>Date: </small></span><b>' + new Date(appointment.date).toUTCString().split(' ', 4).join(' ') + '</b><br><span class="info-window"><small>Start time: </small></span><b>' + appointment.starttime.slice(0, 5) + '</b><br><span class="info-window"><small>End time: </small></span><b>' + appointment.endtime.slice(0, 5) + '</b></p><small><p><span class="info-window">Notes: </span><span class="notes ml-2">' + appointment.notes + '</span></p></small></div>'

                    }
                    else if (_.isEqual(appointment.user_id, user.user_id)) {

                         infocontents = '<br><div class="pl-2"><b><span class="info-window">' + user.username + '\'s  event:</span></b><br><p><strong><big><b><span class="title-window">' + appointment.title + '</span></b></big></strong><br><small><span class="title-help">' + appointment.address + '</span></small></p><p><span class="info-window"><small>Date: </small></span><b>' + new Date(appointment.date).toUTCString().split(' ', 4).join(' ') + '</b><br><span class="info-window"><small>Start time: </small></span><b>' + appointment.starttime.slice(0, 5) + '</b><br><span class="info-window"><small>End time: </small></span><b>' + appointment.endtime.slice(0, 5) + '</b></p><small><p><span class="info-window">Notes: </span><span class="notes ml-2">' + appointment.notes + '</span></p></small></div>'

                    }
                });
            }
        });

        pending.forEach(function(pendingEvent) {

            if (_.isEqual(pendingEvent.address, restaurant.address) && !appointmentMarker) {

                pendingMarker = true;

                icon = {
                    url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                    size: new google.maps.Size(50, 50),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(32, 32)
                };

                users.forEach(function(user){


                    if (_.isEqual(user_id, user.user_id)) {

                         infocontents = '<br><div class="pl-2"><b><span class="info-window">Your  event:</span></b><br><p><strong><big><b><span class="title-window"><i> Invitation pending to: ' + pendingEvent.title + '</i></span></b></big></strong><br><small><span class="title-help">' + pendingEvent.address + '</span></small></p><p><span class="info-window"><small>Date: </small></span><b>' + new Date(pendingEvent.date).toUTCString().split(' ', 4).join(' ') + '</b><br><span class="info-window"><small>Start time: </small></span><b>' + pendingEvent.starttime.slice(0, 5) + '</b><br><span class="info-window"><small>End time: </small></span><b>' + pendingEvent.endtime.slice(0, 5) + '</b></p><small><p><span class="info-window">Notes: </span><span class="notes ml-2">' + pendingEvent.notes + '</span></p></small></div>'

                    }
                    else if (_.isEqual(pendingEvent.user_id, user.user_id)) {

                         infocontents = '<br><div class="pl-2"><b><span class="info-window">' + user.username + '\'s  event:</span></b><br><p><strong><big><b><span class="title-window"><i> Invitation pending to: ' + pendingEvent.title + '</i></span></b></big></strong><br><small><span class="title-help">' + pendingEvent.address + '</span></small></p><p><span class="info-window"><small>Date: </small></span><b>' + new Date(pendingEvent.date).toUTCString().split(' ', 4).join(' ') + '</b><br><span class="info-window"><small>Start time: </small></span><b>' + pendingEvent.starttime.slice(0, 5) + '</b><br><span class="info-window"><small>End time: </small></span><b>' + pendingEvent.endtime.slice(0, 5) + '</b></p><small><p><span class="info-window">Notes: </span><span class="notes ml-2">' + pendingEvent.notes + '</span></p></small></div>'

                    }
                });
            }
        });

        if(!appointmentMarker && !pendingMarker) {

            icon = {
                url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                size: new google.maps.Size(50, 50),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(32, 32)
            }; 

            infocontents = '<form id="add_item_form"><div class="form-group"><input id="id" class="form-control" type="hidden" value="' + restaurant.id + '"></div><div class="form-group"><label for="title">Place:</label><input id="title" class="form-control" type="text" aria-describedby="titleHelp" placeholder="' + restaurant.title + '"  value="' + restaurant.title + '" minlength="2" readonly></div><div class="form-group"><label for="address">Address:</label><input id="address" class="form-control" type="text" aria-describedby="addressHelp" placeholder="' + restaurant.address + '"  value="' + restaurant.address + '" minlength="2" readonly></div><div class="form-group"><label for="date">Date:</label><input id="date" class="form-control" type="date" aria-describedby="dateHelp" placeholder="yyyy-mm-dd" required><small id="dateHelp" class="form-text text-muted">Please enter the date in the specified format.</small></div><div class="form-group"><label for="starttime">Start time:</label><input id="starttime" class="form-control time" type="time" aria-describedby="starttimeHelp" placeholder="hh:mm" required><small id="starttimeHelp" class="form-text text-muted">Please enter a start time between 00:00 and 23:59.</small></div><div class="form-group"><label for="endtime">End time:</label><input id="endtime" class="form-control time" type="time" aria-describedby="endtimeHelp" placeholder="hh:mm" required><small id="endtimeHelp" class="form-text text-muted">Please enter an end time between 00:00 and 23:59.</small></div><div class="form-group"><label for="textareaNotes">Notes:</label><textarea class="form-control" id="textareaNotes" rows="3"></textarea></div><input id="submit" type="submit" class="btn btn-secondary mb-5" value="Submit"></form>'

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

                    google.maps.event.addListener(infowindow, 'domready', function() {

                        // Bind the click event on your button here

                        var form = $('#add_item_form')

                        form.validate({
                            onsubmit: true,
                            success: function(label) {
                                label.addClass("valid").text("Ok!")
                            },
                            submitHandler: function() { alert("Submitted!") }
                        });

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
        size: new google.maps.Size(50, 50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(32, 32)
    };


}

function alertEventCreated(title) {
    alert("Your event at " + title + " was created. Check it out on the map, or in your schedule!")
}

function alertOops() {
    alert("Oops! Something went wrong. Please try again.")
}


$(document).ready(function(){

    $.validator.addMethod( "date", function( value, element ) {
        var check = false,
            re = /^\d{4}\-\d{1,2}\-\d{1,2}$/,
            adata, aaaa, mm, gg, xdata;
        if ( re.test( value ) ) {
            adata = value.split( "-" );
            aaaa = parseInt( adata[ 0 ], 10 );
            gg = parseInt( adata[ 2 ], 10 );
            mm = parseInt( adata[ 1 ], 10 );
            xdata = new Date( Date.UTC( aaaa, mm - 1, gg, 12, 0, 0, 0 ) );
            if ( ( xdata.getUTCFullYear() === aaaa ) && ( xdata.getUTCMonth() === mm - 1 ) && ( xdata.getUTCDate() ===  gg ) ) {
                check = true;
            } else {
                check = false;
            }
        } else {
            check = false;
        }
        return this.optional( element ) || check;
    }, $.validator.messages.date);

    $('body').fadeIn(500);

    $('#search-discover-input').attr("placeholder","Restaurant name or street address");

});


