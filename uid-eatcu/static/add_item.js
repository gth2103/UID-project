var add_item = function(newItem){
    var item_to_add = newItem
    $.ajax({
        type: "POST",
        url: "add_item",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(item_to_add),
        success: function(result){
            console.log(result);
            var all_characters = result["characters"]
            var title =  '<div>Success!</div>'
            var body =  '<div>Follow the link to view you character: \n<a href="/item/' + all_characters.length + '">New Character</a></div>'
            clearModal
            showModal(title, body)
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}
var clearModal = function(){
    $('.modal-title').empty()
    $('.modal-body').empty()
}

var showModal = function(title, body){
    $('.modal-title').html(title)
    $('.modal-body').html(body)
    $('#modalValid').modal('show');
}

var yearSelector =  function(start, end, options){
    for(var year = start; year <= end; year++) {
        options += '<option>' + year + '</option>'
    }
    $('#appear').html(options)
}

var form = $('#add_item_form')

$(document).ready(function(){

    var start = 1938

    var end =  new Date().getFullYear()
    var options = "<option disabled selected value> Select ... </option>"

    yearSelector(start, end, options)

    form.validate()

    $('#submit').on('click', function(e){

        e.preventDefault();
       
        var title = $('input#title').val()
        var img = $('input#img').val()
        var stat = $('input[type=radio][name=inlineRadioOptions1]:checked').val()
        var summary = $.trim($('textarea#textareaSummary').val()).replace(/\"/g, "\\\"")
        var align = $('select#align').val()
        var eye = $('select#eye').val()
        var hair = $('select#hair').val()
        var gender = $('input[type=radio][name=inlineRadioOptions2]:checked').val()
        var alive = $('input[type=radio][name=inlineRadioOptions3]:checked').val()
        var appear = $('select#appear').val()

        var newItem = jQuery.parseJSON( '{ "title": "' + title + '", "img": "' + img + '", "stat": "' + stat + '", "summary": "' + summary + '",  "align": "' + align + '", "eye": "' + eye + '", "hair": "' + hair + '", "gender": "' + gender + '", "alive": "' + alive + '", "appear": "' + appear + '" }') 


            console.log($('#align').val());

        if(form.valid() && $('#title').val() != ""  && 	$('#img').val() != "" && $('#textareaSummary').val() != "" && $('#align').val() != null  && $('#eye').val() != null  && $('#hair').val() != null  && $('#appear').val() != null && typeof($('#img').val()) == "url"){
	    add_item(newItem)
        }
        else { 
            var title =  '<div>Oops!</div>'
            var body =  '<div>Something went wrong. Please try again.</div>'
            clearModal
            showModal(title, body)
        } 
    });


});

