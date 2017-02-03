/**
 * Created by marc-iten on 28.01.17.
 */

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
    var $navItem = $('<nav><span class="fa fa-clock-o"></span><span class="fa fa-tags"></span></nav>');
    var $titleItem = $('<h2></h2>');
    $titleItem.text($ToDoItem.Title);
    $listItem.append($navItem).append($titleItem);

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

$(document).on('click', '.closed .entry', function () {
    $('main .deleted').prepend($(this));

    var $listItem = GetListItemByID($(this).attr('data-listid'));
    $listItem.Status = 'deleted';
    SaveList();
});

$(document).on('click', '.deleted .entry', function () {
    $('main .closed').prepend($(this));

    var $listItem = GetListItemByID($(this).attr('data-listid'));
    $listItem.Status = 'closed';
    SaveList();
});

$(document).on('touchstart', '.entry', handleTouchStart);
$(document).on('touchmove', '.entry', function (evt) {
    switch (handleTouchMove(evt)) {
        case 'left':
            $('main .closed').prepend($(this));
            var $listItem = GetListItemByID($(this).attr('data-listid'));
            $listItem.Status = 'closed';
            SaveList();
            break;
        case 'down':
            window.location.href = 'detail.html';
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

    if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
        if (xDiff > 0) {
            /* left swipe */
            console.log('left swipe');
            return 'left';
        } else {
            /* right swipe */
            console.log('right swipe');
            return 'right';
        }
    } else {
        if (yDiff > 0) {
            /* up swipe */
            console.log('up swipe');
            return 'up';
        } else {
            /* down swipe */
            console.log('down swipe');
            return 'down';
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
};