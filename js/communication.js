/**
 * Created by marc-iten on 11.02.17.
 */

/*
 var TaskCache = {

 _tasks: undefined,

 getTasks: function () {
 return _tasks ? _tasks : LoadTasks();
 }
 }
 */


function TasksCache() {
    var _tasks;

    /**
     * Lädt die Tasks vom Cache
     * @returns {Array} Tasks
     */
    var getTasks = function () {
        if(!_tasks)
            _tasks = loadTasks();

        return _tasks;
    };

    /**
     * Lädt die Tasks vom LocalStorage
     * @returns {Array} Tasks
     */
    var loadTasks = function () {
        if (typeof (Storage) !== undefined) {
            try {
                var tmp = localStorage.getItem("Tasks");
                if (tmp != null) {
                    return JSON.parse(tmp);
                }
            } catch (ex) {
                console.error(ex);
            }
        }
        return [];
    };

    /**
     * Speichert die Tasks im LocalStorage
     * @param Tasks
     * @returns {boolean} Speichern erfolgreich
     */
    var saveTasks = function (Tasks) {
        if (typeof (Storage) !== undefined) {
            try {
                localStorage.setItem("Tasks", Tasks);
                return true;
            } catch (ex) {
                console.error(ex);
            }
        }
        return false;
    };

    /**
     * Gibt die nächste ID der Tasks zurück
     * @returns {number}
     */
    var getNextID = function () {
        if (!_tasks || _tasks.length == 0) {
            return 1;
        }

        // gibt die grösste ID zurück
        var result = Math.max.apply(null, _tasks.map(function (e, i, a) {
            return e.ID;
        }));

        return result == null ? 1 : result + 1;
    };

    /**
     * Fügt einen Task dem Cache hinzu und speichert diesen
     * @param Task
     * @returns {boolean} Gibt True zurück, wenn erfolgreich
     */
    var addTask = function (Task) {
        Task.ID = getNextID();
        _tasks.push(Task);
        return saveTasks(_tasks);
    }

    /**
     * Löscht einen Task aus dem Cache und speichert diesen
     * @param Task
     * @returns {boolean} Gibt True zurück, wenn erfolgreich
     */
    var removeTask = function (Task) {
        if (_tasks.indexOf(Task) >= 0) {
            _tasks.splice(_tasks.indexOf(Task), 1);
            return saveTasks(_tasks);
        } else if (_tasks.filter(function (e, i, a) {
                return e.ID == Task.ID;
            }).length == 1) {
            return removeTaskByID(_tasks.filter(function (e, i, a) {
                return e.ID == Task.ID
            }).map(function (e, i, a) {
                return i;
            })[0]);
        }
        return false;
    }

    /**
     * Löscht einen Task anhand der ID aus dem Cache und speichert diesen
     * @param TaskID
     * @returns {boolean} Gibt True zurück, wenn erfolgreich
     */
    var removeTaskByID = function (TaskID) {
        var tmp = _tasks.filter(function (e, i, a) {
            return e.ID == Task.ID;
        }).map(function (e, i, a) {
            return i;
        });

        if (tmp.length == 1) {
            _tasks.splice(tmp[0], 1);
            return saveTasks(_tasks);
        }
        return false;
    }

    return {
        get: getTasks,
        add: addTask,
        remove: removeTask,
        removeById: removeTaskByID
    };
}
