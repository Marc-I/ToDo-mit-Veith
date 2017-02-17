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

    function RemoveTask(Task) {
        $('.entry[data-listid="' + Task.ID + '"]').remove();
    }

    function EditTask(Task) {
        var $popover = $('<div class="detail"></div>');

        var $id = $('<div class="id"><input type="hidden" value="' + Task.ID + '" id="TaskID"></div>');
        $popover.append($id);

        var $date = $('<div class="date"><input type="date" value="2017-12-24" placeholder="Datum"></div>');
        $popover.append($date);

        var $caption = $('<div class="caption"><input type="text" value="' + Task.Caption + '" placeholder="Titel" id="TaskCaption"></div>');
        $popover.append($caption);

        var $description = $('<div class="description"><textarea placeholder="Beschreibung..."></textarea></div>');
        $popover.append($description);

        var $tagarea = $('<div class="tagarea"><span class="badge">Tag 1</span><span class="badge">Tag 2</span><span class="badge">Tag 3</span><span class="badge">Tag 4</span></div>');
        $popover.append($tagarea);

        var $footer = $('<footer><div><span class="close fa fa-times-circle-o"></span><span class="save fa fa-check-circle-o"></span></div></footer>');
        $popover.append($footer);

        $('body').append($popover);
    }

    function CloseDetails(Task) {
        _changeTask(Task);
        $('.detail').remove();
    }

    function _changeTask(Task) {
        var $task = $('.entry[data-listid="' + Task.ID + '"]');
        $task.children('h2').text(Task.Caption);
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
        RemoveTask: RemoveTask,
        EditTask: EditTask,
        CloseDetails: CloseDetails,
        RemoveAllLeftAndRightClasses: RemoveAllLeftAndRightClasses,/**/
    };
}