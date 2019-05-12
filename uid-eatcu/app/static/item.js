//@TODO: Address, website button (place details), find friends (by e-mail/username), 
//@TODO: create username,  add friends, invite friends button, update events button, message friends
//@TODO: toggle between upcoming and all events
//@TODO: start-time end-time between 00:00 and 23:59

var restaurant;
var count  = 2;


function get_appointments() {

    appointments.forEach(function(appointment) {


        if(user_id == appointment.user_id) {

            if  (count++ % 2 == 0) {
                restaurant = '<br><div class="' + appointment.id + ' bg-light p-4"><p><strong><big><b><span class="title">' + appointment.title + '</span></b></big></strong><button accesskey="' + appointment.id + '" type="button" class="delete btn btn-outline-danger mt-2 ml-2 float-right">Delete</button><button type="button" class="update btn btn-outline-warning mt-2 ml-2 float-right">Update</button></p><p><small>' + appointment.address + '</p></small><br><p><span class="info"><small>Date: </small></span>' + new Date(appointment.date).toUTCString().split(' ', 4).join(' ') + '</p><p><span class="info"><small>Start time: </small></span>' + appointment.starttime.slice(0, 5) + '</p><p><span class="info"><small>End time: </small></span>' + appointment.endtime.slice(0, 5) + '</p><br><small><p><span class="info">Notes: </span><br><span class="notes">' + appointment.notes + '</span></p></small><br><hr><p><span class="invite-people">Who\'s Invited?</span><img accesskey="' + appointment.id + '"  class="invite-people-img d-inline-block align-center" src="../static/images/add-icon-614x460.png" width="75" height="" alt=""></p><div accesskey="' + appointment.id + '"  class="searchbar d-block"></div><div accesskey="' + appointment.id + '" class="invited"></div></div>'
            }
            else {
                restaurant = '<br><div class="' + appointment.id + ' bg-white p-4"><p><strong><big><b><span class="title">' + appointment.title + '</span></b></big></strong><button accesskey="' + appointment.id + '"  type="button" class="delete btn btn-outline-danger mt-2 ml-2 float-right">Delete</button><button type="button" class="update btn btn-outline-warning mt-2 ml-2 float-right">Update</button></p><p><small>' + appointment.address + '</p></small><br><p><span class="info"><small>Date: </small></span>' + new Date(appointment.date).toUTCString().split(' ', 4).join(' ') + '</p><p><span class="info"><small>Start time: </small></span>' + appointment.starttime.slice(0, 5) + '</p><p><span class="info"><small>End time: </small></span>' + appointment.endtime.slice(0, 5) + '</p><br><small><p><span class="info">Notes: </span><br><span class="notes">' + appointment.notes + '</span></p></small><br><hr><p><span class="invite-people">Who\'s Invited?</span><img accesskey="' + appointment.id + '"  class="invite-people-img d-inline-block align-center" src="../static/images/add-icon-614x460.png" width="75" height="" alt=""></p><div accesskey="' + appointment.id + '"  class="searchbar d-block"></div><div  accesskey="' + appointment.id + '" class="invited"></div></div>'
            }
        }
        else {

            if  (count++ % 2 == 0) {
                restaurant = '<br><div class="' + appointment.id + ' bg-light p-4"><p><strong><big><b><span class="title">' + appointment.title + '</span></b></big></strong></p><p><small>' + appointment.address + '</p></small><br><p><span class="info"><small>Date: </small></span>' + new Date(appointment.date).toUTCString().split(' ', 4).join(' ') + '</p><p><span class="info"><small>Start time: </small></span>' + appointment.starttime.slice(0, 5) + '</p><p><span class="info"><small>End time: </small></span>' + appointment.endtime.slice(0, 5) + '</p><br><small><p><span class="info">Notes: </span><br><span class="notes">' + appointment.notes + '</span></p></small><br><hr><p><span class="invite-people">Who\'s Invited?</span><img accesskey="' + appointment.id + '"  class="invite-people-img d-inline-block align-center" src="../static/images/add-icon-614x460.png" width="75" height="" alt=""></p><div accesskey="' + appointment.id + '"  class="searchbar d-block"></div><div accesskey="' + appointment.id + '" class="invited"></div></div>'
            }
            else {
                restaurant = '<br><div class="' + appointment.id + ' bg-white p-4"><p><strong><big><b><span class="title">' + appointment.title + '</span></b></big></strong></p><p><small>' + appointment.address + '</p></small><br><p><span class="info"><small>Date: </small></span>' + new Date(appointment.date).toUTCString().split(' ', 4).join(' ') + '</p><p><span class="info"><small>Start time: </small></span>' + appointment.starttime.slice(0, 5) + '</p><p><span class="info"><small>End time: </small></span>' + appointment.endtime.slice(0, 5) + '</p><br><small><p><span class="info">Notes: </span><br><span class="notes">' + appointment.notes + '</span></p></small><br><hr><p><span class="invite-people">Who\'s Invited?</span><img accesskey="' + appointment.id + '"  class="invite-people-img d-inline-block align-center" src="../static/images/add-icon-614x460.png" width="75" height="" alt=""></p><div accesskey="' + appointment.id + '"  class="searchbar d-block"></div><div  accesskey="' + appointment.id + '" class="invited"></div></div>'
            }
        }

        

        $('#appointments').append(restaurant);
        getInvites(appointment.id, appointment.user_id);
    });

    pending.forEach(function(appointment) {

        if  (count++ % 2 == 0) {
            restaurant = '<br><div class="' + appointment.id + ' bg-light p-4"><p><strong><big><b><span class="title-pending"><i> Invitation pending to: ' + appointment.title + '</i></span></b></big></strong></p><p><small>' + appointment.address + '</p></small><br><p><span class="info"><small>Date: </small></span>' + new Date(appointment.date).toUTCString().split(' ', 4).join(' ') + '</p><p><span class="info"><small>Start time: </small></span>' + appointment.starttime.slice(0, 5) + '</p><p><span class="info"><small>End time: </small></span>' + appointment.endtime.slice(0, 5) + '</p><br><small><p><span class="info">Notes: </span><br><span class="notes">' + appointment.notes + '</span></p></small><br><hr><p><span class="invite-people">Who\'s Invited?</span><img accesskey="' + appointment.id + '"  class="invite-people-img d-inline-block align-center" src="../static/images/add-icon-614x460.png" width="75" height="" alt=""></p><div accesskey="' + appointment.id + '"  class="searchbar d-block"></div><div accesskey="' + appointment.id + '" class="invited"></div></div>'
        }
        else {
            restaurant = '<br><div class="' + appointment.id + ' bg-white p-4"><p><strong><big><b><span class="title-pending"><i> Invitation pending to: ' + appointment.title + '</i></span></b></big></strong></p><p><small>' + appointment.address + '</p></small><br><p><span class="info"><small>Date: </small></span>' + new Date(appointment.date).toUTCString().split(' ', 4).join(' ') + '</p><p><span class="info"><small>Start time: </small></span>' + appointment.starttime.slice(0, 5) + '</p><p><span class="info"><small>End time: </small></span>' + appointment.endtime.slice(0, 5) + '</p><br><small><p><span class="info">Notes: </span><br><span class="notes">' + appointment.notes + '</span></p></small><br><hr><p><span class="invite-people">Who\'s Invited?</span><img accesskey="' + appointment.id + '"  class="invite-people-img d-inline-block align-center" src="../static/images/add-icon-614x460.png" width="75" height="" alt=""></p><div accesskey="' + appointment.id + '"  class="searchbar d-block"></div><div  accesskey="' + appointment.id + '" class="invited"></div></div>'
        }

        $('#appointments').append(restaurant);
        getInvites(appointment.id, appointment.user_id);
    });
}


function getInvites(event_key, event_user_id) {

    invites.forEach(function(invite){

        user  = invite.username.split(" ");
        name = user[0]


        if(event_key === invite.event_id) { 
            if(invite.accepted) {// @TODO: if invite.accepted = 1
                if (!(username === name) && event_user_id ===  user_id) { // accepted (not yours but your event)
                    $('div[accesskey|="' +  event_key + '"].invited').append("<span class='" + name + " " + event_key + "'><small>" +  invite.username + "</small><a class='" + name + " " + event_key + " delete-invite float-right mr-4' href='#'>&times;</a><br></span><div class='clearfix'></div>");
                    applyFeatures(name, event_key)
                }
                else if ((username === name) && !(event_user_id ===  user_id)) { // accepted (yours but not your event)
                    $('div[accesskey|="' +  event_key + '"].invited').append("<span class='" + name + " " + event_key + "'><small>" +  invite.username + "</small><a class='" + name + " " + event_key + " delete-invite float-right mr-4' href='#'>&times;</a><br></span><div class='clearfix'></div>");
                    applyFeatures(name, event_key)
                }
                else {
                    $('div[accesskey|="' +  event_key + '"].invited').append("<span class='" + name + " " + event_key + "'><small>" +  invite.username + "</small><br></span><div class='clearfix'></div>");
                    applyFeatures(name, event_key)
                }
            }
            else if (username === name){ // pending & (yours)
                $('div[accesskey|="' +  event_key + '"].invited').append("<span class='" + name + " " + event_key + "'><span class='pending'><small><i>" +  invite.username + "&nbsp;pending&nbsp;&nbsp;&nbsp;<strong><a class='" + name + " " + event_key + " accept' href='#'>click here to accept</a></strong></i></small></span><a class='" + name + " " + event_key + " delete-invite float-right mr-4' href='#'>&times;</a><br></span><div class='clearfix'></div>"); 
                applyFeatures(name, event_key)   
            }
             else if (event_user_id ===  user_id){ // pending & (your event but not yours)
                $('div[accesskey|="' +  event_key + '"].invited').append("<span class='" + name + " " + event_key + "'><span class='pending'><small><i>" +  invite.username + "&nbsp;pending</i></small></span><a class='" + name + " " + event_key + " delete-invite float-right mr-4' href='#'>&times;</a><br></span><div class='clearfix'></div>");
                applyFeatures(name, event_key)   
            }
            else {
                $('div[accesskey|="' +  event_key + '"].invited').append("<span class='" + name + " " + event_key + "'><span class='pending'><small><i>" +  invite.username + "&nbsp;pending</i></small></span><br></span><div class='clearfix'></div>");
                applyFeatures(name, event_key)
            }
        }
    });
}


var searchbar = '<form class="form-inline"><div class="input-group"><div class="input-group-prepend"><span class="input-group-text" id="basic-addon1">@</span></div><input type="text" class="form-control searchbar-input" placeholder="" aria-label="Username" aria-describedby="basic-addon1"></div></form>'


function alertDeleted() {
    alert("Your event was deleted.")
}

function alertDeletedInvitation() {
    alert("Your invitation was deleted.")
}

function alertAcceptedInvitation() {
    alert("Your invitation was accepted.")
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

function hoverX(name, event_key){

    $('a.' + name + '.' + event_key + '.delete-invite').hover(function() {
        $('span.' + name + '.' + event_key).addClass('rgba-teal-slight')
    }, function() {
        $('span.' + name + '.' + event_key).removeClass('rgba-teal-slight')
    });
}

function hoverUser(name, event_key){

    $('div[accesskey|="' +  event_key + '"].invited').hover(function() {
        $('a.' + name + '.' + event_key + '.delete-invite').css('visibility','visible')
    }, function() {
        $('a.' + name + '.' + event_key + '.delete-invite').css('visibility','hidden')
    });
}

function format(name, event_key){
    $('span.' + name + '.' + event_key).addClass('p-1 pl-2 pr-2')
    $('a.' + name + '.' + event_key  + '.delete-invite').css('visibility','hidden')
}


function deleteInvite(name, event_key){
    $('a.' + name + '.' + event_key  + '.delete-invite').on('click', function(e) {

        e.preventDefault()

        if (window.confirm("Are you sure you want to delete this invition?")) {

            var url = "/remove_invitation/" + event_key + "/" + name

            $.post(url);
            alertDeletedInvitation();
            setTimeout(function(){
                location.reload(1);
            }, 800);
        }       
    });
}


function applyFeatures(name, event_key){
    format(name, event_key)
    hoverX(name, event_key)
    hoverUser(name, event_key)
    deleteInvite(name, event_key)
    acceptInvite(name, event_key)
}


function acceptInvite(name, event_key){
    $('a.' + name + '.' + event_key  + '.accept').on('click', function(e) {

        e.preventDefault()

            var url = "/accept_invitation/" + event_key + "/" + name

            $.post(url);
            alertAcceptedInvitation();
            setTimeout(function(){
                location.reload(1);
            }, 800);       
    });
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

                var currentUserEvent  = false;

                appointments.forEach(function(appointment){

                    var event_key  = $('.searchbar-input').parent().parent().parent().attr('accesskey')

                    if(event_key == appointment.id && user_id == appointment.user_id) {

                        currentUserEvent = true;

                        var alreadyInvited = false;

                        var username = $('.searchbar-input').val();

                        invites.forEach(function(invite){

                            user  = invite.username.split(" ");
                            name = user[0]

                            if(name === username && event_key == invite.event_id){

                                alreadyInvited = true;

                                alertAlreadyInvited(username)

                            }
                        });

                        if (users.includes(username) && !alreadyInvited) {
                            var event_key = $('.searchbar-input').parent().parent().parent().attr('accesskey');
                            var url = "/invite_people/" + event_key + "/" + username

                            $.post(url);
                            alertInvited(username)
                            getInvites(event_key, appointment.user_id)
                            setTimeout(function(){
                                location.reload(1);
                            }, 800);  
                        }
                        else if(!alreadyInvited){
                            alertNotFound(username)
                        }
                    }
                });

                if (!currentUserEvent){
                    alertNotAuthorized()
                }
            }
        });
    });
});
