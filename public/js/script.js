$(function () {
    $('#search').keyup(function () {
        const search_term = $(this).val();

        $.ajax({
            method: 'POST',
            url: '/api/search',
            data: {
                search_term
            },
            dataType: 'json',
            success: function (json) {
                let data = json.hits.hits.map((hit)=>{return hit;});
                $('#search-results').empty();
                for (let i=0;i<data.length;i++){
                    var html ='' +
                        '<div class="col-md-4">' +
                        '<a href="/product/'+data[i]._id+'">' +
                        '<div class="thumbnail">' +
                        '<img src="'+data[i]._source.image+'">' +
                        '<div class="caption">' +
                        '<h3>'+data[i]._source.name+'</h3>' +
                        '<p>'+data[i]._source.category.name+'</p>' +
                        '<p>$'+ data[i]._source.price+'</p>' +
                        '</div></div></a></div>';
                    $('#search-results').append(html)
                }
                },
            error: function (error) {
                console.log(error);
            }
        });
    });
});


$(document).on('click', '#plus', function(e) {
    e.preventDefault();
    var priceValue = parseFloat($('#priceValue').val());
    var quantity = parseInt($('#quantity').val());

    priceValue += parseFloat($('#priceHidden').val());
    quantity += 1;

    $('#quantity').val(quantity);
    $('#priceValue').val(priceValue.toFixed(2));
    $('#total').html(quantity);
});


$(document).on('click', '#minus', function(e) {
    e.preventDefault();
    var priceValue = parseFloat($('#priceValue').val());
    var quantity = parseInt($('#quantity').val());


    if (quantity == 1) {
        priceValue = $('#priceHidden').val();
        quantity = 1;
    } else {
        priceValue -= parseFloat($('#priceHidden').val());
        quantity -= 1;
    }

    $('#quantity').val(quantity);
    $('#priceValue').val(priceValue.toFixed(2));
    $('#total').html(quantity);
});
