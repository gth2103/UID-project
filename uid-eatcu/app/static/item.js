//@TODO: Address, website button (place details), find friends (by e-mail/username), 
//@TODO: create username,  add friends, invite friends button, update events button, message friends
//@TODO: toggle between upcoming and all events
//@TODO: start-time end-time between 00:00 and 23:59

var restaurant;
var count  = 2;


function get_appointments() {

    appointments.forEach(function(appointment) {

        count++;

        if  (count % 2 == 0) {
            restaurant = '<br><div class="' + appointment.id + ' bg-light p-4"><p><strong><big><b><span class="title">' + appointment.title + '</span></b></big></strong></p><p><small>' + appointment.address + '</p></small><br><p><span class="info"><small>Date: </small></span>' + appointment.date + '</p><p><span class="info"><small>Start time: </small></span>' + appointment.starttime + '</p><p><span class="info"><small>End time: </small></span>' + appointment.endtime + '</p><br><small><p><span class="info">Notes: </span><br><span class="notes">' + appointment.notes + '</span></p></small><br><hr><p><span class="add-friends">Friends</span><img class="add-friends-img d-inline-block align-center" src="../static/images/add-icon-614x460.png" width="75" height="" alt=""><button id="' + appointment.id + '" type="button" class="delete btn btn-outline-danger mt-2 ml-2 float-right">Delete</button><button type="button" class="update btn btn-outline-warning mt-2 ml-2 float-right">Update</button><button type="button" class="update btn btn-outline-secondary mt-2 ml-2 float-right">Info</button></p></div>'
        }
        else {
            restaurant = '<br><div class="' + appointment.id + ' bg-white p-4"><p><strong><big><b><span class="title">' + appointment.title + '</span></b></big></strong></p><p><small>' + appointment.address + '</p></small><br><p><span class="info"><small>Date: </small></span>' + appointment.date + '</p><p><span class="info"><small>Start time: </small></span>' + appointment.starttime + '</p><p><span class="info"><small>End time: </small></span>' + appointment.endtime + '</p><br><small><p><span class="info">Notes: </span><br><span class="notes">' + appointment.notes + '</span></p></small><br><hr><p><span class="add-friends">Friends</span><img class="add-friends-img d-inline-block align-center" src="../static/images/add-icon-614x460.png" width="75" height="" alt=""><button id="' + appointment.id + '"  type="button" class="delete btn btn-outline-danger mt-2 ml-2 float-right">Delete</button><button type="button" class="update btn btn-outline-warning mt-2 ml-2 float-right">Update</button><button type="button" class="update btn btn-outline-secondary mt-2 ml-2 float-right">Info</button></p></div>'
        }

        $('#appointments').append(restaurant);
    });
}

function alertSent() {
    alert("Your message was sent!")
}

$(document).ready(function(){

    get_appointments();

    $('.email').on('click', function() {

        $('.modal').modal('show');
    });

    $('.delete').on('click', function() {

   if (window.confirm("Are you sure you want to delete this event?")) {

        var event_id = $(this).attr('id');
        var url = "/remove_event/" + event_id;
        var target = '.' + event_id;

        $.post(url);
        setTimeout(function(){
            location.reload(1);
        }, 800);
     }
        
    });
});
