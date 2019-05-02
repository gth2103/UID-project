var restaurant;
var count  = 2;


function get_appointments() {

    appointments.forEach(function(appointment) {

        count++;

        if  (count % 2 == 0) {
            restaurant = '<br><div class="' + appointment.id + ' bg-light p-2"><p><strong><big><b><span class="title">' + appointment.title + '</span></b></big></strong></p><br><p><span class="info">Date: </span>' + appointment.date + '</p><p><span class="info">Start time: </span>' + appointment.starttime + '</p><p><span class="info">End time: </span>' + appointment.endtime + '</p><p><span class="info">Notes: </span><br><span class="notes">' + appointment.notes + '</span></p><p><button type="button" class="email btn btn-outline-secondary" data-toggle="modal" data-target="#exampleModal">Email</button><button id="' + appointment.id + '" type="button" class="delete btn btn-outline-danger ml-2 float-right">Delete</button></p></div>'
        }
        else {
            restaurant = '<br><div class="' + appointment.id + ' p-2"><p><strong><big><b><span class="title">' + appointment.title + '</span></b></big></strong></p><br><p><span class="info">Date: </span>' + appointment.date + '</p><p><span class="info">Start time: </span>' + appointment.starttime + '</p><p><span class="info">End time: </span>' + appointment.endtime + '</p><p><span class="info">Notes: </span><br><span class="notes">' + appointment.notes + '</span></p><p><button type="button" class="email btn btn-outline-secondary" data-toggle="modal" data-target="#exampleModal">Email</button><button id="' + appointment.id + '"  type="button" class="delete btn btn-outline-danger ml-2 float-right">Delete</button></p></div>'
        }

        $('#appointments').append(restaurant);
    });
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
