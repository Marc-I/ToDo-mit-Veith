/**
 * Created by marc-iten on 16.02.17.
 */

var DomEvents = function () {

    function AddTask(Task) {

        var $listItem = $('<li class="entry"></li>');
        $listItem.attr('data-listid', Task.ID);

        var $titleItem = $('<h2></h2>');
        $titleItem.text(Task.Caption);

        $listItem
            .append('<nav><span class="fa fa-clock-o"></span><span class="fa fa-tags"></span></nav>')
            .append($titleItem);

        $('main .' + Task.Status).prepend($listItem);
    }

    function MoveTask(Task) {
        $('.entry[data-listid="' + Task.ID + '"]').prependTo('main .' + Task.Status);
    }

    function RemoveTask(TaskID) {
        $('.entry[data-listid="' + TaskID + '"]').remove();
    }

    // Funktion, die alle offenen Optionen der Tasks schliesst
    function RemoveAllLeftAndRightClasses() {

        // entfernt alle "rightButtons"-Klassen
        $('.rightButtons').removeClass('rightButtons');

        // entfernt alle "leftButtons"-Klassen
        $('.leftButtons').removeClass('leftButtons');
    }

    return {
        AddTask: AddTask,
        MoveTask: MoveTask,
        RemoveAllLeftAndRightClasses: RemoveAllLeftAndRightClasses,/**/
    };
}