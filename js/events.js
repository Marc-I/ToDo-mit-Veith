/**
 * Created by marc-iten on 16.02.17.
 */

$(document).ready(function () {
    var tasks = new Tasks();
    var domEvents = new DomEvents();

    tasks.Init();

    $('#search input').on('keydown', function (event) {
        domEvents.RemoveAllLeftAndRightClasses();
        if (event.keyCode == 13) {
            tasks.Add($(this).val());
            $(this).val('');
        }
    });

    $(document).on('click', '.check-button', function (event) {
        domEvents.RemoveAllLeftAndRightClasses();
        tasks.Settle($(this).parent().attr('data-listid'));
    });

    $(document).on('click', '.undo-button', function (event) {
        domEvents.RemoveAllLeftAndRightClasses();
        tasks.Undo($(this).parent().attr('data-listid'));
    });

    $(document).on('click', '.trash-button', function (event) {
        domEvents.RemoveAllLeftAndRightClasses();
        tasks.Delete($(this).parent().attr('data-listid'));
    });

    $(document).on('click', '.edit-button', function (event) {
        domEvents.RemoveAllLeftAndRightClasses();
        tasks.Edit($(this).parent().attr('data-listid'));
    });

    $(document).on('click', '.detail .close', function (event) {
       $('.detail').remove();
    });

    $(document).on('click', '.detail .save', function (event) {
        tasks.SetCaption($('#TaskID').val(), $('#TaskCaption').val());
    });

    // EventHandler bei einem Swipe (start)
    $(document).on('touchstart', '.entry', function (event) {

        // prüft, ob ein Bearbeiten-Button in diesem DOM-Element existiert
        if ($(this).find('.edit-button').length == 0)

        // fügt alle Buttons dem DOM-Element hinzu
            $(this).append('<span class="edit-button fa"></span><span class="trash-button fa"></span><span class="undo-button fa"></span><span class="check-button fa"></span>');

        // setzt die Variable $targetClassList mit allen Klassen des Elements als Array
        targetClassList = $(this).attr('class').split(/\s+/);

        // setzt die Variable $firstTouch als wahr
        firstTouch = true;

        // ruft die Basis-Funktion für einen Swipe auf
        handleTouchStart(event);
    });

    // EventHandler bei einem Swipe (ende)
    $(document).on('touchend', '.entry', function (evt) {

        // weisst der targetClassList einen leeren Array zu
        targetClassList = [];

        // prüft, ob alle Klassen geschlossen werden müssen
        if (removeClassesAtEnd)

        // schliesst alle offenen Optionen der Tasks
            domEvents.RemoveAllLeftAndRightClasses();

        // setzt die Variable zurück
        removeClassesAtEnd = false;
    });

    // EventHandler bei einem Swipe (ziehen)
    $(document).on('touchmove', '.entry', function (evt) {

        // wählt die TaskID des aktuellen Elements
        var $currentTaskID = $(this).attr('data-listid');

        var move = handleTouchMove(evt);

        if (move == null) {
            return;
        }

        // schliesst alle offenen Optionen der Tasks
        domEvents.RemoveAllLeftAndRightClasses();

        // führt die Basis-Funktion für einen Swipe aus und handelt das Ergebnis
        switch (move) {
            // wird im Falle eines Links-Swipe ausgeführt
            case 'left':

                // prüft, ob die linken Optionen sichtbar sind
                if ($.inArray('leftButtons', targetClassList) < 0)

                // fügt dem Element eine Klasse hinzu, die die rechten Optionen sichtbar macht
                    $(this).addClass('rightButtons');

                // switch abbrechen
                break;
            // wird im Falle eines Rechts-Swipe ausgeführt
            case 'right':

                // prüft, ob die linken Optionen bereits sichtbar sind und die aktuelle Funktion das erste mal ausgeführt wird
                if ($.inArray('leftButtons', targetClassList) >= 0 && firstTouch) {

                    // Variable $firstTouch ändern, damit die Funktion nicht nochmals ausgeführt wird
                    firstTouch = false;

                    // Variable zum entfernen aller Klassen am Ende ändern
                    removeClassesAtEnd = true;

                    // prüft, ob der Status des Elements 'offen' ist
                    if ($(this).parent().hasClass('open')) {

                        // schliesst den aktuellen Task
                        CloseToDo($currentTaskID);
                    } else {

                        // öffnet den aktuellen Task
                        UndoToDo($currentTaskID);
                    }

                    // prüft, ob die rechten Optionen sichtbar sind und am Ende allen Klassen entfernt werden sollen
                } else if ($.inArray('rightButtons', targetClassList) < 0 && !removeClassesAtEnd)

                // fügt dem Element eine Klasse hinzu, die die linken Optionen sichtbar macht
                    $(this).addClass('leftButtons');

                // switch abbrechen
                break;
        }
    });
});

// definieren mehrere Variabeln für den Swipe
var xDown = null;
var yDown = null;
var targetClassList = [];
var firstTouch = false;
var removeClassesAtEnd = false;

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

    if(Math.abs(xDiff) < 10 && Math.abs(yDiff) < 10) {
        return null;
    }

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
    return null;
};
