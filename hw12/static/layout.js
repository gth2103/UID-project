var delete_sale = function(id){
    var sale_to_delete = id
    $.ajax({
        type: "POST",
        url: "delete_sale",                
        dataType : "text",
        contentType: "charset=utf-8",
        data : sale_to_delete.toString(),
        success: function(result){
            console.log(result);
            var salesObj = JSON.parse(result)
            var all_sales = salesObj["sales"]
            sales = all_sales
            display_sales_list(sales)
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

$(document).ready(function(){

});

