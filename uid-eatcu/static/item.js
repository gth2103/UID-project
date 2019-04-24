var character

var display_item = function(characters, item_id) {

    for(var i=0; i < characters.length; i++) {
        if(characters[i].id == item_id){
        character = characters[i]
        }
    }
    var newDiv = '<br><div><p><strong><big><b>' + character.title + '</b></big></strong></p><br><p><span class="info">Appearance: </span>' + character.appear + '</p><p><span class="info">Alive: </span>' + character.alive + '</p><br><p><span class="info">Status: </span>' + character.stat + '</p><p><span class="info">Alignment: </span>' + character.align + '</p><br><p><span class="info">Summary: </span><br><span class="summary">' + character.summary + '</span></p><br><small><p><span class="info">Eye: </span>' + character.eye + '</p><p><span class="info">Hair: </span>' + character.hair + '</p><p><span class="info">Gender: </span>' + character.gender + '</p></small><br><p>Image: <a href="' + character.img + '">Link</a></p><br><br></div>'
    $('#characters').html(newDiv)
}

$(document).ready(function(){

display_item(characters, item_id)

});

