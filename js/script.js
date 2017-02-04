/**
 * Created by marc-iten on 28.01.17.
 */

// Variable, die alle Tasks enthält
var $MyToDoList;

// wird ausgeführt, wenn die Seite komplett geladen ist
$(document).ready(function () {

    // lädt als erstes alle Tasks
    LoadList();

    // alle Tasks werden dem DOM hinzugefügt
    for (var i = 0; i < $MyToDoList.length; i++) {
        AddItem($MyToDoList[i]);
    }
});

// ein einzelner Task dem DOM hinzufügen
function AddItem($ToDoItem) {

    // ein Listenpunkt erstellen
    var $listItem = $('<li class="entry"></li>');

    // dem Listenpunkt das Attribut "data-listid" hinzufügen
    $listItem.attr('data-listid', $ToDoItem.ID);

    // ein Tasktitel-Element erstellen
    var $titleItem = $('<h2></h2>');

    // dem Tasktitel-Element den Titeltext hinzufügen
    $titleItem.text($ToDoItem.Title);

    // dem Listenpunk die Navigationspunke (Uhr und Tags), sowie das Titel-Element hinzufügen
    $listItem
        .append('<nav><span class="fa fa-clock-o"></span><span class="fa fa-tags"></span></nav>')
        .append($titleItem);

    // der richtigen Liste den Listenpunkt hinzufügen
    $('main .' + $ToDoItem.Status).prepend($listItem);
}

// Funktion, die alle Tasks aus dem LocalStorage lädt
function LoadList() {

    // prüft, ob der Storage aufgerufen werden kann
    if (typeof (Storage) !== undefined) {

        // lädt alle Tasks aus dem LocalStorage in die $result-Variable
        var $result = localStorage.getItem('MyToDoList');

        // prüft ein $result besteht
        if ($result != null) {

            // parst das $result aus einem String in Tasks und weist diese der Liste zu
            $MyToDoList = JSON.parse($result);

            // bricht die Funktion vorzeitig ab
            return;
        }
    }

    // falls die Funktion nicht vorzeitig abgebrochen wurde, wir ein leerer Array der Liste zugewiesen
    $MyToDoList = [];
}

// Funktion, die alle Tasks im LocalStorage speichert
function SaveList() {

    // prüft, ob der Storage aufgerufen werden kann
    if (typeof (Storage) !== undefined)

    // fügt dem LocalStorage die Liste als String hinzu
        localStorage.setItem('MyToDoList', JSON.stringify($MyToDoList));
}

// wird ausgeführt, wenn im Suchfeld eine Taste gedrückt wird
$(document).on('keydown', '#search input', function (event) {

    // schliesst alle offenen Optionen der Tasks
    RemoveAllLeftAndRightClasses();
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

function RemoveAllLeftAndRightClasses() {
    $('.rightButtons').removeClass('rightButtons');
    $('.leftButtons').removeClass('leftButtons');
}

function CloseToDo(ListID) {
    var $element = $('.entry[data-listid="' + ListID + '"]');
    $('main .closed').prepend($element);
    // schliesst alle offenen Optionen der Tasks
    RemoveAllLeftAndRightClasses();

    var $listItem = GetListItemByID(ListID);
    $listItem.Status = 'closed';
    SaveList();
}

function UndoToDo(ListID) {
    var $element = $('.entry[data-listid="' + ListID + '"]');
    $('main .open').prepend($element);
    // schliesst alle offenen Optionen der Tasks
    RemoveAllLeftAndRightClasses();

    var $listItem = GetListItemByID(ListID);
    $listItem.Status = 'open';
    SaveList();
}

$(document).on('click', '.trash-button', function (event) {
    event.stopPropagation();
    $('main .deleted').prepend($(this).parent());
    // schliesst alle offenen Optionen der Tasks
    RemoveAllLeftAndRightClasses();

    var $listItem = GetListItemByID($(this).parent().attr('data-listid'));
    $listItem.Status = 'deleted';
    SaveList();
});

$(document).on('click', '.undo-button', function (event) {
    event.stopPropagation();
    UndoToDo($(this).parent().attr('data-listid'));
});

$(document).on('click', '.edit-button', function (event) {
    event.stopPropagation();
    var $currentListID = $(this).parent().attr('data-listid');
    window.location.href = 'detail.html?id=' + $currentListID;
});

$(document).on('click', '.check-button', function () {
    event.stopPropagation();
    CloseToDo($(this).parent().attr('data-listid'));
});

$(document).on('touchstart', '.entry', function (event) {
    if ($(this).find('.edit-button').length == 0)
        $(this).append('<span class="edit-button fa"></span><span class="trash-button fa"></span><span class="undo-button fa"></span><span class="check-button fa"></span>');
    targetClassList = $(this).attr('class').split(/\s+/);
    firstTouch = true;
    handleTouchStart(event);
});
$(document).on('touchend', '.entry', function (evt) {
    //console.log(evt);
    targetClassList = [];
    if (removeClassesAtEnd)
        // schliesst alle offenen Optionen der Tasks
        RemoveAllLeftAndRightClasses();
    removeClassesAtEnd = false;
});
$(document).on('touchmove', '.entry', function (evt) {
    // schliesst alle offenen Optionen der Tasks
    RemoveAllLeftAndRightClasses();
    var $currentElement = $(this);
    var $currentListID = $(this).attr('data-listid');
    switch (handleTouchMove(evt)) {
        case 'left':
            if ($.inArray('leftButtons', targetClassList) < 0)
                $(this).addClass('rightButtons');
            break;
        case 'right':
            if ($.inArray('leftButtons', targetClassList) >= 0 && firstTouch) {
                firstTouch = false;
                removeClassesAtEnd = true;
                if ($currentElement.parent().hasClass('open')) {
                    CloseToDo($currentListID);
                } else {
                    UndoToDo($currentListID);
                }
            } else if ($.inArray('rightButtons', targetClassList) < 0 && !removeClassesAtEnd)
                $(this).addClass('leftButtons');
            break;
        case 'down':
            //window.location.href = 'detail.html?id=' + $currentListID;
            break;
    }
});

var xDown = null;
var yDown = null;
var targetClassList = [];
var firstTouch = false;
var removeClassesAtEnd = false;

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