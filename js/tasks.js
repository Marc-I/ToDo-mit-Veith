/**
 * Created by marc-iten on 16.02.17.
 */

var Tasks = function () {

    function _ajaxCall(URL, Data, Type) {
        return $.ajax({
            type: Type ? Type : 'POST',
            url: URL,
            dataType: 'json',
            data: Data
        })
            .fail(function (e) {
                console.error('ajax error:', e);
            });
    }

    /**
     * Lädt alle Tasks und gibt diese aus
     * @constructor
     */
    function LoadTasks(Status) {
        var promise = _ajaxCall('api/getAllTasks.php', {'Status': Status ? Status : 'open'});

        promise.done(function (data) {
            data.forEach(function (e, i, a) {
                _addHandler(e);
            });
        });
    }

    /**
     * fügt einen Task zur Liste hinzu
     * @param {string} Caption
     * @returns {boolean}
     * @constructor
     */
    function Add(Caption) {
        var promise = _ajaxCall('api/addTask.php', {'Caption': Caption});

        promise.done(function (data) {
            _addHandler(data);
        });
    }

    /**
     * ändert den Status eines Tasks
     * @param {number} TaskID
     * @param {string} Status
     *  'open' | 'closed' | 'deleted'
     * @returns {boolean}
     * @private
     */
    function _changeStatus(TaskID, Status) {
        var promise = _ajaxCall('api/changeTaskStatus.php', {'ID': TaskID, 'Status': Status});

        promise.done(function (data) {
            _removeHandler(data.ID);
        });
    }

    /**
     * ein Task wird als 'erledigt' markiert
     * @param {number} TaskID
     * @returns {boolean}
     * @constructor
     */
    function Settle(TaskID) {
        var task = _changeStatus(TaskID, 'closed');
    }

    /**
     * ein Task wird als 'offen' markiert
     * @param {nummer} TaskID
     * @returns {boolean}
     * @constructor
     */
    function Undo(TaskID) {
        var task = _changeStatus(TaskID, 'open');
    }

    /**
     * ein Task wird als 'gelöscht' markiert
     * @param {number} TaskID
     * @returns {boolean}
     * @constructor
     */
    function Delete(TaskID) {
        var task = _changeStatus(TaskID, 'deleted');
    }

    /**
     * ein Task wird zur Bearbeitung geladen
     * @param {number} TaskID
     * @returns {boolean}
     * @constructor
     */
    function Edit(TaskID) {
        var promise = _ajaxCall('api/getTask.php', {'ID': TaskID });

        promise.done(function (data) {
            _editHandler(data);
        });
    }

    /**
     * der Titel eines Tasks wird geändert
     * @param {number} TaskID
     * @param {string} Caption
     * @returns {boolean}
     * @constructor
     */
    function SetCaption(TaskID, Caption) {
        var promise = _ajaxCall('api/setTaskCaption.php', {'ID': TaskID, 'Caption': Caption});

        promise.done(function (data) {
            _closeHandler(data);
        });
    }

    var domEvents = new DomEvents();

    /**
     * es werden weitere Funktionen ausgeführt
     * @param {any} Value
     * @param {string} Type
     * @private
     */

    function _addHandler(Task) {
        domEvents.AddTask(Task);
    }

    function _removeHandler(TaskID) {
        domEvents.RemoveTask(TaskID);
    }

    function _editHandler(Task) {
        domEvents.EditTask(Task);
    }

    function _closeHandler(Task) {
        domEvents.CloseDetails(Task);
    }

    return {
        LoadTasks: LoadTasks,
        Add: Add,
        Settle: Settle,
        Undo: Undo,
        Delete: Delete,
        Edit: Edit,
        SetCaption: SetCaption,
    };
};





