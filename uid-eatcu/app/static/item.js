var restaurant;
var count  = 2;

function get_appointments() {

    appointments.forEach(function(appointment) {

        count++;

        if  (count % 2 == 0) {
            restaurant = '<br><div class="bg-light p-2"><p><strong><big><b><span class="title">' + appointment.title + '</span></b></big></strong></p><br><p><span class="info">Date: </span>' + appointment.date + '</p><p><span class="info">Start time: </span>' + appointment.starttime + '</p><p><span class="info">End time: </span>' + appointment.endtime + '</p><p><span class="info">Notes: </span><br><span class="notes">' + appointment.notes + '</span></p><p><button type="button" class="email btn btn-outline-secondary" data-toggle="modal" data-target="#exampleModal">Email</button></p></div>'
        }
        else {
            restaurant = '<br><div class="p-2"><p><strong><big><b><span class="title">' + appointment.title + '</span></b></big></strong></p><br><p><span class="info">Date: </span>' + appointment.date + '</p><p><span class="info">Start time: </span>' + appointment.starttime + '</p><p><span class="info">End time: </span>' + appointment.endtime + '</p><p><span class="info">Notes: </span><br><span class="notes">' + appointment.notes + '</span></p><p><button type="button" class="email btn btn-outline-secondary" data-toggle="modal" data-target="#exampleModal">Email</button></p></div>'
        }

        $('#appointments').append(restaurant);
    });
}

$(document).ready(function(){

    $('#email').on('click', function() {

        $('.modal').modal('show');

    });

    get_appointments();

});
