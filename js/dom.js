/**
 * Created by marc-iten on 16.02.17.
 */

var DomEvents = function () {

    /**
     * erstellt ein virtuelles DOM-Element
     * @param {task} Task
     * @returns {*|jQuery|HTMLElement}
     * @private
     */
    function _createTaskElement(Task) {
        var $listItem = $('<li class="entry"></li>');
        $listItem.attr('data-listid', Task.ID);

        var $titleItem = $('<h2></h2>');
        $titleItem.text(Task.Caption);

        $listItem
            .append('<nav><span class="fa fa-clock-o"></span><span class="fa fa-tags"></span></nav>')
            .append($titleItem);
        return $listItem;
    }

    /**
     * fügt einen Task dem DOM hinzu
     * @param {task} Task
     * @constructor
     */
    function AddTask(Task) {
        var $listItem = _createTaskElement(Task);
        $('main .' + Task.Status).prepend($listItem);
    }

    /**
     * verschiebt einen Task von einer Liste zu einer Anderen
     * @param {task} Task
     * @constructor
     */
    function MoveTask(Task) {
        $('.entry[data-listid="' + Task.ID + '"]').prependTo('main .' + Task.Status);
    }

    /**
     * entfernt einen Task aus dem DOM
     * @param {task} Task
     * @constructor
     */
    function RemoveTask(Task) {
        $('.entry[data-listid="' + Task.ID + '"]').remove();
    }

    /**
     * öffnet die Detailansicht eines Tasks
     * @param {task} Task
     * @constructor
     */
    function ShowTaskDetails(Task) {
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

    /**
     * schliesst die Detailansicht
     * @param Task
     * @constructor
     */
    function CloseDetails(Task) {
        _changeTask(Task);
        $('.detail').remove();
    }

    /**
     * ändert den Text in einem Task
     * @param {task} Task
     * @private
     */
    function _changeTask(Task) {
        var $task = $('.entry[data-listid="' + Task.ID + '"]');
        $task.children('h2').text(Task.Caption);
    }

    return {
        AddTask: AddTask,
        MoveTask: MoveTask,
        RemoveTask: RemoveTask,
        EditTask: ShowTaskDetails,
        CloseDetails: CloseDetails,
    };
}