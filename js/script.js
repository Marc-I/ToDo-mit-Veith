/**
 * Created by marc-iten on 28.01.17.
 */

var enTaskStatus = {open: 0, closed: 1, deleted: 2};

var $MyToDoList;
$(document).ready(function () {
    LoadList();
    for (var i = 0; i < $MyToDoList.length; i++) {
        AddItem($MyToDoList[i]);
    }
});

function AddItem($ToDoItem) {
    var $listItem = $('<li class="entry"></li>');
    $listItem.attr('data-listid', $ToDoItem.ID);
    var $titleItem = $('<h2></h2>');
    $titleItem.text($ToDoItem.Title);
    $listItem
        .append('<nav><span class="fa fa-clock-o"></span><span class="fa fa-tags"></span></nav>')
        .append($titleItem);

    $('main .' + $ToDoItem.Status).prepend($listItem);
}

function LoadList() {
    if (typeof (Storage) !== undefined) {
        var $tmp = localStorage.getItem('MyToDoList');
        if ($tmp != null) {
            $MyToDoList = JSON.parse($tmp);
            return;
        }
    }
    $MyToDoList = [];
}

function SaveList() {
    if (typeof (Storage) !== undefined)
        localStorage.setItem('MyToDoList', JSON.stringify($MyToDoList));
}

$(document).on('keydown', '#search input', function (event) {
    RemoveAllTrashAndEditClasses();
    if (event.keyCode == 13) {
        var newItem = {Status: 'open', Title: $(this).val(), ID: GetNextID()};
        AddItem(newItem);
        $MyToDoList.push(newItem);
        SaveList();
        //$('main .open').prepend('<li class="entry"><a href="#"><nav><span class="fa fa-clock-o"></span><span class="fa fa-tags"></span></nav><h2>' + $(this).val() + '</h2></a></li>');
        $(this).val('');
    }
});

function GetNextID() {
    if ($MyToDoList == null || $MyToDoList.length == 0)
        return 1;

    var $result = Math.max.apply(null, $MyToDoList.map(function (o) {
        return o.ID;
    }));
    return $result == null ? 1 : $result + 1;
}

function GetListItemByID($ListID) {
    return $MyToDoList.filter(function (f) {
        return f.ID == $ListID;
    })[0];
}

function RemoveAllTrashAndEditClasses() {
    $('.trash').removeClass('trash');
    $('.edit').removeClass('edit');
}

$(document).on('click', '.trash-button', function (event) {
    event.stopPropagation();
    $('main .deleted').prepend($(this).parent());
    RemoveAllTrashAndEditClasses();

    var $listItem = GetListItemByID($(this).parent().attr('data-listid'));
    $listItem.Status = 'deleted';
    SaveList();
});

$(document).on('click', '.edit-button', function (event) {
    event.stopPropagation();
    var $currentListID = $(this).parent().attr('data-listid');
    window.location.href = 'detail.html?id=' + $currentListID;
});

$(document).on('click', '.open .entry', function () {
    $('main .closed').prepend($(this));
    RemoveAllTrashAndEditClasses();

    var $listItem = GetListItemByID($(this).attr('data-listid'));
    $listItem.Status = 'closed';
    SaveList();
});

/*$(document).on('click', '.closed .entry', function () {
 $('main .deleted').prepend($(this));

 var $listItem = GetListItemByID($(this).attr('data-listid'));
 $listItem.Status = 'deleted';
 SaveList();
 });*/

/*$(document).on('click', '.deleted .entry', function () {
 $('main .closed').prepend($(this));

 var $listItem = GetListItemByID($(this).attr('data-listid'));
 $listItem.Status = 'closed';
 SaveList();
 });*/

$(document).on('touchstart', '.entry', function(event){
    if ($(this).find('.edit-button').length == 0)
        $(this).append('<span class="edit-button fa"></span><span class="trash-button fa"></span>');
    handleTouchStart(event);
});
/*$(document).on('touchend', '.entry', function (evt) {
 console.log(evt);
 });*/
$(document).on('touchmove', '.entry', function (evt) {
    RemoveAllTrashAndEditClasses();
    var $currentElement = $(this);
    var $currentListID = $(this).attr('data-listid');
    switch (handleTouchMove(evt)) {
        case 'left':
            $(this).addClass('trash');
            /*            $('main .closed').prepend($currentElement);
             var $listItem = GetListItemByID($currentListID);
             $listItem.Status = 'closed';
             SaveList();
             */
            break;
        case 'right':
            $(this).addClass('edit');
            /*            $('main .open').prepend($currentElement);
             var $listItem = GetListItemByID($currentListID);
             $listItem.Status = 'open';
             SaveList();
             */
            break;
        case 'down':
            //window.location.href = 'detail.html?id=' + $currentListID;
            break;
    }
});

//document.addEventListener('touchstart', handleTouchStart, false);
//document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;
var yDown = null;

function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
};

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return null;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    //console.log('x:', xDiff);
    //console.log('y:', yDiff);

    if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
        if (xDiff > 0) {
            /* left swipe */
            return 'left';
        } else if (xDiff < 0) {
            /* right swipe */
            return 'right';
        }
    } else {
        if (yDiff > 0) {
            /* up swipe */
            return 'up';
        } else if (yDiff < 0) {
            /* down swipe */
            return 'down';
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
};