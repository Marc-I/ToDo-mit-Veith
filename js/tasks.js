/**
 * Created by marc-iten on 16.02.17.
 */

var Tasks = function () {

    function _loadAllTasks() {
        return $.ajax({
            type: "GET",
            url: "api/tasklist.php",
            dataType: "json"
        })
            .fail(function (e) {
                console.error(e);
            });
    }

    /**
     * lädt Tasks aus dem LocalStorage
     * @returns {Array}
     * @private
     */
    function _load() {
        var response;

        $.ajax({
            type: "GET",
            url: "api/tasklist.php",
            dataType: "json",
            async: false,
            success: function (data) {
                response = data;
            },
            error: function (data) {
                console.error(data);
                response = [];
            }
        });

        return response;
    }

    /**
     * speichert Tasks in den LocalStorage
     * @param {Array} tasks
     *  Array von Tasks
     * @returns {boolean}
     *  'true', wenn erfolgreich
     * @private
     */
    function _save(tasks) {
        if (typeof (Storage) !== 'undefined') {
            localStorage.setItem('TaskItems', JSON.stringify(tasks));
            return true;
        }
        return false;
    }

    /**
     * Berechnet die nächste freie ID
     * @returns {number}
     * @private
     */
    function _getNextID() {
        var tasks = _load();

        if (tasks.length == 0)
            return 1;

        var result = Math.max.apply(null, tasks.map(function (o) {
            return o.ID;
        }));
        return result == null ? 1 : result + 1;
    }

    /**
     * Lädt alle Tasks und gibt diese aus
     * @constructor
     */
    function Init() {
       var tasks = _loadAllTasks();

       tasks.done(function (data) {
           if (data && data.length > 0) {
               data.filter(function (e, i, a) {
                   return e.Status != 'deleted';
               }).forEach(function (e, i, a) {
                   _addHandler(e);
               });
           }
       });
    }

    /**
     * fügt einen Task zur Liste hinzu
     * @param {string} Caption
     * @returns {boolean}
     * @constructor
     */
    function Add(Caption) {
        var newTask = {ID: _getNextID(), Caption: Caption, Status: "open"};

        var tasks = _load();
        tasks.push(newTask);
        _save(tasks);

        _addHandler(newTask);
        return true;
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
        var tasks = _load();
        var task = tasks.filter(function (e, i, a) {
            return e.ID == TaskID;
        });
        if (task.length != 1) {
            return null;
        }
        task[0].Status = Status;
        if (_save(tasks)) {
            return task[0];
        }
    }

    /**
     * führt eine Aktion mit einem Task aus
     * @param {Task} Task
     * @param {string} Action
     * @returns {boolean}
     * @private
     */
    function _callActionAfterStatus(Task, Action) {
        _moveHandler(Task);
        return true;
    }

    /**
     * ein Task wird als 'erledigt' markiert
     * @param {number} TaskID
     * @returns {boolean}
     * @constructor
     */
    function Settle(TaskID) {
        var task = _changeStatus(TaskID, 'closed');
        return _callActionAfterStatus(task);
    }

    /**
     * ein Task wird als 'offen' markiert
     * @param {nummer} TaskID
     * @returns {boolean}
     * @constructor
     */
    function Undo(TaskID) {
        var task = _changeStatus(TaskID, 'open');
        return _callActionAfterStatus(task);
    }

    /**
     * ein Task wird als 'gelöscht' markiert
     * @param {number} TaskID
     * @returns {boolean}
     * @constructor
     */
    function Delete(TaskID) {
        var task = _changeStatus(TaskID, 'deleted');
        return _callActionAfterStatus(task, 'remove');
    }

    /**
     * ein Task wird zur Bearbeitung geladen
     * @param {number} TaskID
     * @returns {boolean}
     * @constructor
     */
    function Edit(TaskID) {
        var tasks = _load();
        var task = tasks.filter(function (e, i, a) {
            return e.ID == TaskID;
        });
        if (task.length != 1)
            return false;

        _editHandler(task[0]);

        return true;
    }

    /**
     * der Titel eines Tasks wird geändert
     * @param {number} TaskID
     * @param {string} Caption
     * @returns {boolean}
     * @constructor
     */
    function SetCaption(TaskID, Caption) {
        var tasks = _load();
        var task = tasks.filter(function (e, i, a) {
            return e.ID == TaskID;
        });
        if (task.length != 1)
            return false;

        task[0].Caption = Caption;
        _save(tasks);

        _closeHandler(task[0]);

        return true;
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

    function _moveHandler(Task) {
        domEvents.MoveTask(Task);
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
        Init: Init,
        Add: Add,
        Settle: Settle,
        Undo: Undo,
        Delete: Delete,
        Edit: Edit,
        SetCaption: SetCaption,
    };
};





