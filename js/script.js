/**
 * Created by marc-iten on 28.01.17.
 */

$(document).on('keydown', '#search input', function (event) {
    if (event.keyCode == 13) {
        $('main .open').prepend('<li class="entry"><a href="#"><nav><span class="fa fa-clock-o"></span><span class="fa fa-tags"></span></nav><h2>' + $(this).val() + '</h2></a></li>');
        $(this).val('');
    }
});

$(document).on('click', '.open .entry', function () {
    $('main .closed').prepend($(this));
});

$(document).on('click', '.closed .entry', function () {
    $('main .deleted').prepend($(this));
});

$(document).on('mousedown', '.entry', function (event) {
    console.log(event);
});
