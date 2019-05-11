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
            restaurant = '<br><div class="' + appointment.id + ' bg-light p-4"><p><strong><big><b><span class="title">' + appointment.title + '</span></b></big></strong><button accesskey="' + appointment.id + '" type="button" class="delete btn btn-outline-danger mt-2 ml-2 float-right">Delete</button><button type="button" class="update btn btn-outline-warning mt-2 ml-2 float-right">Update</button></p><p><small>' + appointment.address + '</p></small><br><p><span class="info"><small>Date: </small></span>' + new Date(appointment.date).toUTCString().split(' ', 4).join(' ') + '</p><p><span class="info"><small>Start time: </small></span>' + appointment.starttime.slice(0, 5) + '</p><p><span class="info"><small>End time: </small></span>' + appointment.endtime.slice(0, 5) + '</p><br><small><p><span class="info">Notes: </span><br><span class="notes">' + appointment.notes + '</span></p></small><br><hr><p><span class="invite-people">Who\'s Invited?</span><img accesskey="' + appointment.id + '"  class="invite-people-img d-inline-block align-center" src="../static/images/add-icon-614x460.png" width="75" height="" alt=""></p><div accesskey="' + appointment.id + '"  class="searchbar d-block"></div><div accesskey="' + appointment.id + '" class="invited"></div></div>'
        }
        else {
            restaurant = '<br><div class="' + appointment.id + ' bg-white p-4"><p><strong><big><b><span class="title">' + appointment.title + '</span></b></big></strong><button accesskey="' + appointment.id + '"  type="button" class="delete btn btn-outline-danger mt-2 ml-2 float-right">Delete</button><button type="button" class="update btn btn-outline-warning mt-2 ml-2 float-right">Update</button></p><p><small>' + appointment.address + '</p></small><br><p><span class="info"><small>Date: </small></span>' + new Date(appointment.date).toUTCString().split(' ', 4).join(' ') + '</p><p><span class="info"><small>Start time: </small></span>' + appointment.starttime.slice(0, 5) + '</p><p><span class="info"><small>End time: </small></span>' + appointment.endtime.slice(0, 5) + '</p><br><small><p><span class="info">Notes: </span><br><span class="notes">' + appointment.notes + '</span></p></small><br><hr><p><span class="invite-people">Who\'s Invited?</span><img accesskey="' + appointment.id + '"  class="invite-people-img d-inline-block align-center" src="../static/images/add-icon-614x460.png" width="75" height="" alt=""></p><div accesskey="' + appointment.id + '"  class="searchbar d-block"></div><div  accesskey="' + appointment.id + '" class="invited"></div></div>'
        }

        $('#appointments').append(restaurant);
        getInvites(appointment.id);
    });

    pending.forEach(function(appointment) {

        count++;

        if  (count % 2 == 0) {
            restaurant = '<br><div class="' + appointment.id + ' bg-light p-4"><p><strong><big><b><span class="title-pending"><i> Invitation pending to: ' + appointment.title + '</i></span></b></big></strong><button accesskey="' + appointment.id + '" type="button" class="delete btn btn-outline-danger mt-2 ml-2 float-right">Delete</button><button type="button" class="update btn btn-outline-warning mt-2 ml-2 float-right">Update</button></p><p><small>' + appointment.address + '</p></small><br><p><span class="info"><small>Date: </small></span>' + new Date(appointment.date).toUTCString().split(' ', 4).join(' ') + '</p><p><span class="info"><small>Start time: </small></span>' + appointment.starttime.slice(0, 5) + '</p><p><span class="info"><small>End time: </small></span>' + appointment.endtime.slice(0, 5) + '</p><br><small><p><span class="info">Notes: </span><br><span class="notes">' + appointment.notes + '</span></p></small><br><hr><p><span class="invite-people">Who\'s Invited?</span><img accesskey="' + appointment.id + '"  class="invite-people-img d-inline-block align-center" src="../static/images/add-icon-614x460.png" width="75" height="" alt=""></p><div accesskey="' + appointment.id + '"  class="searchbar d-block"></div><div accesskey="' + appointment.id + '" class="invited"></div></div>'
        }
        else {
            restaurant = '<br><div class="' + appointment.id + ' bg-white p-4"><p><strong><big><b><span class="title-pending"><i> Invitation pending to: ' + appointment.title + '</i></span></b></big></strong><button accesskey="' + appointment.id + '"  type="button" class="delete btn btn-outline-danger mt-2 ml-2 float-right">Delete</button><button type="button" class="update btn btn-outline-warning mt-2 ml-2 float-right">Update</button></p><p><small>' + appointment.address + '</p></small><br><p><span class="info"><small>Date: </small></span>' + new Date(appointment.date).toUTCString().split(' ', 4).join(' ') + '</p><p><span class="info"><small>Start time: </small></span>' + appointment.starttime.slice(0, 5) + '</p><p><span class="info"><small>End time: </small></span>' + appointment.endtime.slice(0, 5) + '</p><br><small><p><span class="info">Notes: </span><br><span class="notes">' + appointment.notes + '</span></p></small><br><hr><p><span class="invite-people">Who\'s Invited?</span><img accesskey="' + appointment.id + '"  class="invite-people-img d-inline-block align-center" src="../static/images/add-icon-614x460.png" width="75" height="" alt=""></p><div accesskey="' + appointment.id + '"  class="searchbar d-block"></div><div  accesskey="' + appointment.id + '" class="invited"></div></div>'
        }

        $('#appointments').append(restaurant);
        getInvites(appointment.id);
    });
}


function getInvites(event_key) {

    invites.forEach(function(invite){
        if(event_key === invite.event_id) { 
            if(invite.accepted) {// @TODO: if invite.accepted = 1
                $('div[accesskey|="' +  event_key + '"].invited').append("<small>" +  invite.username + "</small><br>"); 
            }
            else if (username == invite.username){
                $('div[accesskey|="' +  event_key + '"].invited').append("<span class='pending'><small><i>" +  invite.username + "&nbsp;pending&nbsp;&nbsp;<strong><a href='#'>click here to accept</a></strong></i></small></span><br>");    
            }
            else {
                $('div[accesskey|="' +  event_key + '"].invited').append("<span class='pending'><small><i>" +  invite.username + "&nbsp;pending</span><br>");
            }
        }
    });
}


var searchbar = '<form class="form-inline"><div class="input-group"><div class="input-group-prepend"><span class="input-group-text" id="basic-addon1">@</span></div><input type="text" class="form-control searchbar-input" placeholder="" aria-label="Username" aria-describedby="basic-addon1"></div></form>'


function alertDeleted() {
    alert("Your event was deleted.")
}

function alertInvited(username) {
    alert(username + " was invited.")
}

function alertAlreadyInvited(username) {
    alert(username + " has already been invited.")
}

function alertNotFound(username) {
    alert(username + " was not found.")
}

function alertNotAuthorized() {
    alert("You are not authorized to invite people to this event.")
}

$(document).ready(function(){

    get_appointments();

    $('.delete').on('click', function() {

   if (window.confirm("Are you sure you want to delete this event?")) {

        var event_key = $(this).attr('accesskey');
        var url = "/remove_event/" + event_key;
        var target = '.' + event_key;

        $.post(url);
        alertDeleted();
        setTimeout(function(){
            location.reload(1);
        }, 800);
     }
        
    });

    $('.invite-people-img').on('click',  function(){

        var event_key = $(this).attr('accesskey');

        var div = $('div[accesskey|="' +  event_key + '"].searchbar');

        if(div.children().length === 0){
            $(div).append(searchbar);
        }
        else{
            $(div).empty();
        }

        $('.searchbar-input').autocomplete({
            source: users
        });

        $('.searchbar-input').on('keydown', function( e ) {
            if ( e.which == 13) {


                appointments.forEach(function(appointment){

                    var event_key  = $('.searchbar-input').parent().parent().parent().attr('accesskey')


                    if(event_key == appointment.id && user_id == appointment.user_id) {

                        var alreadyInvited = false;

                        var username = $('.searchbar-input').val();

                        invites.forEach(function(invite){

                            if(invite.username === username){

                                alreadyInvited = true;

                                alertAlreadyInvited(username)

                            }
                        });

                        if (users.includes(username) && !alreadyInvited) {
                            var event_key = $('.searchbar-input').parent().parent().parent().attr('accesskey');
                            var url = "/invite_people/" + event_key + "/" + username

                            $.post(url);
                            alertInvited(username)
                            getInvites(event_key)
                            setTimeout(function(){
                                location.reload(1);
                            }, 800);  
                        }
                        else if(!alreadyInvited){
                            alertNotFound(username)
                        }
                    }
                    else {
                        alertNotAuthorized()
                    }
                });
            }
        });
    });

});
