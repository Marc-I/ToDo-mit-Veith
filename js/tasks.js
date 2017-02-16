/**
 * Created by marc-iten on 16.02.17.
 */

var Tasks = function () {

    // laden
    function _load() {
        if (typeof (Storage) !== undefined) {
            var tmp = localStorage.getItem('TaskItems');
            if (tmp != null)
                return JSON.parse(tmp);
        }
        return [];
    }

    // speichern
    function _save(tasks) {
        if (typeof (Storage) !== undefined) {
            localStorage.setItem('TaskItems', JSON.stringify(tasks));
            return true;
        }
        return false;
    }

    function _getNextID() {
        var tasks = _load();

        if (tasks.length == 0)
            return 1;

        var result = Math.max.apply(null, tasks.map(function (o) {
            return o.ID;
        }));
        return result == null ? 1 : result + 1;
    }

    function Init() {
        var tasks = _load();
        tasks.forEach(function (e, i, a) {
            _handler(e, 'add')
        });
    }

    // hinzufügen (caption) => id || null
    function Add(Caption) {
        var newTask = {ID: _getNextID(), Caption: Caption, Status: "open"}

        var tasks = _load();
        tasks.push(newTask);
        _save(tasks);

        _handler(newTask, 'add');
        return true;
    }

    function _changeStatus(TaskID, Status) {
        var tasks = _load();
        var task = tasks.filter(function (e, i, a) {
            return e.ID == TaskID;
        });
        if(task.length != 1)
            return false;
        task[0].Status = Status;
        _save(tasks);

        _handler(task[0], 'move');
        return true;
    }

    // erledigen (id)
    function Settle(TaskID) {
        return _changeStatus(TaskID, 'closed');
    }

    // aktivieren (id)
    function Undo(TaskID) {
        return _changeStatus(TaskID, 'open');
    }

    // löschen (id)
    function Delete(TaskID) {
        return _changeStatus(TaskID, 'deleted');
    }

    // aktualisieren (id, caption)

    var domEvents = new DomEvents();
    function _handler(Value, Type) {
        switch (Type) {
            case 'add': domEvents.AddTask(Value); break;
            case 'move': domEvents.MoveTask(Value); break;
        }
    }

    return {
        Init: Init,
        Add: Add,
        Settle: Settle,
        Undo: Undo,
        Delete: Delete,
    };
}

