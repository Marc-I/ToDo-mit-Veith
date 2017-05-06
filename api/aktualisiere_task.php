<?php
/**
 * Aktualisiert einen Task mit entsprechender ID
 *
 * Benötigte Werte:
 *
 * ID, ID des Tasks
 * [Caption], Text des Tasks
 * [Status], Status des Tasks
 */

function execute()
{
    // Werte die mit dem Verb PATCH kommen in Variable $_PATCH sichern
    parse_str(file_get_contents("php://input", "r"), $_PATCH);


    // Überprüfen der eingehenden Werte (ID, Caption, Status)
    // eventuelle Fehlermeldung senden (400)
    if (!isset($_PATCH['id'])) {
        // => wenn wir keine ID bekommen haben, schmeissen wir einen Fehler, (header 400)
        // und geben eine entsprechende Meldung aus
        http_response_code(400);
        $message["msg"] = "Keine ID";
        $message["dev_msg"] = "du hast die ID vergessen";
        return $message;
    } else {
        $taskId = $_PATCH['id'];
    }


    /**
     * Task den wir bearbeiten wollen holen/laden/abrufen ($task)
     */

    $taskliste = json_decode(file_get_contents('../_unsichtaber_fuer_vito/tasklist.json'), true);

    // Wir iterieren durch die Taskliste und referenzieren den entsprechenden Task auf die Variable $task
    foreach ($taskliste as &$tmp) {
        if ($tmp['id'] == $taskId) {
            $task = &$tmp;
        }
    }

    // eventuelle Fehlermeldung senden (falls der Task nicht existiert) (404)
    if (!isset($task)) {
        http_response_code(404);
        $message['msg'] = "Task existiert nicht";
        return $message;
    }

    // Task mit den übergebenen Werten aktualisieren (Caption,Status)
    if (isset($_PATCH['caption'])) {
        $task['caption'] = strip_tags($_PATCH['caption']);
    }

    if (isset($_PATCH['status'])) {
        // Wir erwarten den Status offen oder closed
        if ($_PATCH['status'] == "open") {
            $task['status'] = "open" ;
        }
        if ($_PATCH['status'] == "closed") {
            $task['status'] = "closed";
        }

    }

    // Task Speichern
    // eventuellen Fehler senden wenn der Speichervorgang nicht geklappt hat (500)
    $save = file_put_contents('../_unsichtaber_fuer_vito/tasklist.json', json_encode($taskliste, JSON_UNESCAPED_UNICODE));
    if(!$save){
        http_response_code(500);
        $message['msg'] = "Task konnte nicht gespeichert werden";
        return $message;
    };


    // Meldung/Antwort senden wenn alles geklappt hat.

    $message['msg'] = "Der Task wurde aktualisert";
    return $message;
}