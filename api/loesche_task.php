<?php
/**
 * Löscht einen Task mit der entspechenden id
 *
 * Benötigte Werte:
 *
 * id => id des Tasks
 *
 */


function execute()
{
    // Werte die mit dem Verb DELETE kommen in Variable sichern
    parse_str(file_get_contents("php://input", "r"),$_DELETE);

    // Prüfe ob wir überhaupt eine ID bekommen haben
    if (!isset($_DELETE['id'])) {
        // => wenn wir keine ID bekommen haben, schmeissen wir einen Fehler, (header 400)
        // und geben eine entsprechende Meldung aus
        http_response_code(400);
        $message["msg"] = "Keine ID";
        $message["dev_msg"] = "du hast die ID vergessen";
        return $message;
    } else {
        $taskId = $_DELETE['id'];
    }

    // Taskliste laden
    $taskliste = json_decode(file_get_contents('../_unsichtaber_fuer_vito/tasklist.json'), true);


    // Wir löschen das  Element mit der entsprechenden ID aus der Liste
    // dafür müssen wir durch alle elemente der taskliste durchgehen und den mit der richtigen id löschen
    foreach ($taskliste as $index => $task) {
        if ($task['id'] == $taskId) {
            unset($taskliste[$index]);
        }
    }

    // Wir speichern die Liste
    file_put_contents('../_unsichtaber_fuer_vito/tasklist.json', json_encode($taskliste, JSON_UNESCAPED_UNICODE));

    // Melden das alles geklappt hat
    // => header (200), message
    $message['msg'] = "Task entfernt";
    return $message;

}