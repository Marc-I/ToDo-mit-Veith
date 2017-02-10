/**
 * Created by marc-iten on 28.01.17.
 */

// Variable, die alle Tasks enthält
var myToDoList;

// wird ausgeführt, wenn die Seite komplett geladen ist
$(document).ready(function () {

    // lädt als erstes alle Tasks
    LoadList();

    // alle Tasks werden dem DOM hinzugefügt
    for (var i = 0; i < myToDoList.length; i++) {
        AddItemToDomList(myToDoList[i]);
    }
});

/**
 * einen einzelnen Task dem DOM hinzufügen
 * @param todoItem Objekt
 */
function AddItemToDomList(todoItem) {

    // ein Listenpunkt erstellen
    var $listItem = $('<li class="entry"></li>');

    // dem Listenpunkt das Attribut "data-listid" hinzufügen
    $listItem.attr('data-listid', todoItem.ID);

    // ein Tasktitel-Element erstellen
    var $titleItem = $('<h2></h2>');

    // dem Tasktitel-Element den Titeltext hinzufügen
    $titleItem.text(todoItem.Title);

    // dem Listenpunk die Navigationspunke (Uhr und Tags), sowie das Titel-Element hinzufügen
    $listItem
        .append('<nav><span class="fa fa-clock-o"></span><span class="fa fa-tags"></span></nav>')
        .append($titleItem);

    // der richtigen Liste den Listenpunkt hinzufügen
    $('main .' + todoItem.Status).prepend($listItem);
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
            myToDoList = JSON.parse($result);

            // bricht die Funktion vorzeitig ab
            return;
        }
    }

    // falls die Funktion nicht vorzeitig abgebrochen wurde, wir ein leerer Array der Liste zugewiesen
    myToDoList = [];
}

// Funktion, die alle Tasks im LocalStorage speichert
function SaveList() {

    // prüft, ob der Storage aufgerufen werden kann
    if (typeof (Storage) !== undefined)

    // fügt dem LocalStorage die Liste als String hinzu
        localStorage.setItem('MyToDoList', JSON.stringify(myToDoList));
}

// wird ausgeführt, wenn im Suchfeld eine Taste gedrückt wird
$(document).on('keydown', '#search input', function (event) {

    // schliesst alle offenen Optionen der Tasks
    RemoveAllLeftAndRightClasses();

    // überprüft, ob die Enter-Taste gedrückt wurde
    if (event.keyCode == 13) {

        // erstellt einen neuen Task
        var newItem = {Status: 'open', Title: $(this).val(), ID: GetNextID()};

        // fügt den neuen Task dem DOM hinzu
        AddItemToDomList(newItem);

        // fügt der Liste den Task hinzu
        myToDoList.push(newItem);

        // speichert die Liste
        SaveList();

        // leert das Such-Feld
        $(this).val('');
    }
});

// Funktion, die die nächste ID für einen neuen Task ermittelt
function GetNextID() {

    // prüft, ob die Liste nicht existiert oder leer ist und gibt dann 1 zurück
    if (myToDoList == null || myToDoList.length == 0)
        return 1;
    
    // gibt die grösste ID zurück
    var $result = Math.max.apply(null, myToDoList.map(function (o) {
        return o.ID;
    }));
    
    // gibt bei einem Fehler 1 zurück, ansonsten die Grösste ID + 1
    return $result == null ? 1 : $result + 1;
}

// Funktion, die ein Task anhand der ID zurückgibt
function GetListItemByID(ListID) {
    
    // filtert die Liste nach der übergebenen ID und gibt das erste Element zurück
    return myToDoList.filter(function (f) {
        return f.ID == ListID;
    })[0];
}

// Funktion, die alle offenen Optionen der Tasks schliesst
function RemoveAllLeftAndRightClasses() {

    // entfernt alle "rightButtons"-Klassen
    $('.rightButtons').removeClass('rightButtons');

    // entfernt alle "leftButtons"-Klassen
    $('.leftButtons').removeClass('leftButtons');
}

// Funktion, die einen Task als "geschlossen" markiert (anhand der ID)
function CloseToDo(ListID) {
    
    // wählt das Element aus dem DOM
    var $element = $('.entry[data-listid="' + ListID + '"]');
    
    // fügt das DOM-Element der DOM-Liste der geschlossenen Tasks hinzu
    $('main .closed').prepend($element);

    // schliesst alle offenen Optionen der Tasks
    RemoveAllLeftAndRightClasses();

    // wählt den Task aus der Liste
    var $listItem = GetListItemByID(ListID);
    
    // gibt den Task den Status "geschlossen"
    $listItem.Status = 'closed';
    
    // speichert die Liste
    SaveList();
}

// Funktion, die einen Task als "offen" markiert (anhand der ID)
function UndoToDo(ListID) {

    // wählt das Element aus dem DOM
    var $element = $('.entry[data-listid="' + ListID + '"]');

    // fügt das DOM-Element der DOM-Liste der offenen Tasks hinzu
    $('main .open').prepend($element);

    // schliesst alle offenen Optionen der Tasks
    RemoveAllLeftAndRightClasses();
    
    // wählt den Task aus der Liste
    var $listItem = GetListItemByID(ListID);

    // gibt den Task den Status "offen"
    $listItem.Status = 'open';

    // speichert die Liste
    SaveList();
}

// EventHandler bei einem Klick auf den Mülleimer-Button
$(document).on('click', '.trash-button', function (event) {
    
    // Bubbeling ausschalten
    event.stopPropagation();
    
    // Task-Element aus dem DOM der DOM-Liste für geschlossene Tasks hinzufügen
    $('main .deleted').prepend($(this).parent());

    // schliesst alle offenen Optionen der Tasks
    RemoveAllLeftAndRightClasses();

    // wählt den Task aus der Liste
    var $listItem = GetListItemByID($(this).parent().attr('data-listid'));

    // gibt den Task den Status "gelöscht"
    $listItem.Status = 'deleted';

    // speichert die Liste
    SaveList();
});

// EventHandler bei einem Klick auf den Reset-Button
$(document).on('click', '.undo-button', function (event) {

    // Bubbeling ausschalten
    event.stopPropagation();
    
    // Task als "offen" markieren
    UndoToDo($(this).parent().attr('data-listid'));
});

// EventHandler bei einem Klick auf den Bleistift-Button
$(document).on('click', '.edit-button', function (event) {

    // Bubbeling ausschalten
    event.stopPropagation();

    // liest die ID des Tasks aus dem Attribut data-listid
    var $currentTaskID = $(this).parent().attr('data-listid');
    
    // leitet den User auf die Detail-Seite des Tasks weiter
    window.location.href = 'detail.html?id=' + $currentTaskID;
});

// EventHandler bei einem Klick auf den Haken-Button
$(document).on('click', '.check-button', function () {

    // Bubbeling ausschalten
    event.stopPropagation();

    // Task als "geschlossen" markieren
    CloseToDo($(this).parent().attr('data-listid'));
});

// EventHandler bei einem Swipe (start)
$(document).on('touchstart', '.entry', function (event) {
    
    // prüft, ob ein Bearbeiten-Button in diesem DOM-Element existiert
    if ($(this).find('.edit-button').length == 0)

        // fügt alle Buttons dem DOM-Element hinzu
        $(this).append('<span class="edit-button fa"></span><span class="trash-button fa"></span><span class="undo-button fa"></span><span class="check-button fa"></span>');
    
    // setzt die Variable $targetClassList mit allen Klassen des Elements als Array
    $targetClassList = $(this).attr('class').split(/\s+/);
    
    // setzt die Variable $firstTouch als wahr
    $firstTouch = true;

    // schliesst alle offenen Optionen der Tasks
    RemoveAllLeftAndRightClasses();
    
    // ruft die Basis-Funktion für einen Swipe auf
    handleTouchStart(event);
});

// EventHandler bei einem Swipe (ende)
$(document).on('touchend', '.entry', function (evt) {

    // weisst der $targetClassList einen leeren Array zu
    $targetClassList = [];

    // prüft, ob alle Klassen geschlossen werden müssen
    if ($removeClassesAtEnd)
        
        // schliesst alle offenen Optionen der Tasks
        RemoveAllLeftAndRightClasses();
    
    // setzt die Variable zurück
    $removeClassesAtEnd = false;
});

// EventHandler bei einem Swipe (ziehen)
$(document).on('touchmove', '.entry', function (evt) {

    // wählt die TaskID des aktuellen Elements
    var $currentTaskID = $(this).attr('data-listid');

    // wählt den aktuellen Task
    var $currentTask = GetListItemByID($currentTaskID);

    // führt die Basis-Funktion für einen Swipe aus und handelt das Ergebnis
    switch (handleTouchMove(evt)) {
        // wird im Falle eines Links-Swipe ausgeführt
        case 'left':

            // prüft, ob die linken Optionen sichtbar sind
            if ($.inArray('leftButtons', $targetClassList) < 0)

                // fügt dem Element eine Klasse hinzu, die die rechten Optionen sichtbar macht
                $(this).addClass('rightButtons');

            // switch abbrechen
            break;
        // wird im Falle eines Rechts-Swipe ausgeführt
        case 'right':

            // prüft, ob die linken Optionen bereits sichtbar sind und die aktuelle Funktion das erste mal ausgeführt wird
            if ($.inArray('leftButtons', $targetClassList) >= 0 && $firstTouch) {

                // Variable $firstTouch ändern, damit die Funktion nicht nochmals ausgeführt wird
                $firstTouch = false;

                // Variable zum entfernen aller Klassen am Ende ändern
                $removeClassesAtEnd = true;

                // prüft, ob der Status des Elements 'offen' ist
                if ($currentTask.Status == 'open') {

                    // schliesst den aktuellen Task
                    CloseToDo($currentTaskID);
                } else {

                    // öffnet den aktuellen Task
                    UndoToDo($currentTaskID);
                }

                // prüft, ob die rechten Optionen sichtbar sind und am Ende allen Klassen entfernt werden sollen
            } else if ($.inArray('rightButtons', $targetClassList) < 0 && !$removeClassesAtEnd)

                // fügt dem Element eine Klasse hinzu, die die linken Optionen sichtbar macht
                $(this).addClass('leftButtons');

            // switch abbrechen
            break;
    }
});

// definieren mehrere Variabeln für den Swipe
var xDown = null;
var yDown = null;
var $targetClassList = [];
var $firstTouch = false;
var $removeClassesAtEnd = false;

// Funktion, die beim Start des Swipe ausgeführt wird
function handleTouchStart(evt) {

    // die Anfangs-X-Position wird der Variable xDown zugewiesen
    xDown = evt.touches[0].clientX;

    // die Anfangs-Y-Position wird der Variable yDown zugewiesen
    yDown = evt.touches[0].clientY;
};

// Funktion, die beim wischen ausgeführt wird
function handleTouchMove(evt) {

    // falls die Variabeln xDown und yDown nicht gesetzt sind, wird die Funktion abgebrochen
    if (!xDown || !yDown) {
        return null;
    }

    // die aktuellen x und y Positionen werden ausgelesen
    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    // die Differenz zu den Start-Positionen werden berechnet
    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    // es wird überprüft, ob es sich um einen horizontalen oder vertikalen Wisch handelt
    if (Math.abs(xDiff) > Math.abs(yDiff)) {

        // es wird überprüft, ob nach links gewischt wurde
        if (xDiff > 0) {
            return 'left';

            // es wird überprüft, ob nach rechts gewischt wurde
        } else if (xDiff < 0) {
            return 'right';
        }
    } else {

        // es wird überprüft, ob nach oben gewischt wurde
        if (yDiff > 0) {
            return 'up';

            // es wird überprüft, ob nach unten gewischt wurde
        } else if (yDiff < 0) {
            return 'down';
        }
    }

    // die x und y Positionen werden zurückgesetzt
    xDown = null;
    yDown = null;
};