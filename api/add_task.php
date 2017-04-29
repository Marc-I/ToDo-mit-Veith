<?php
/**
 * Created by PhpStorm.
 * User: veith
 * Date: 29.04.17
 * Time: 11:42
 *
 * Hier wird ein Task der Liste hinzugefügt,
 * Benötigte Parameter:
 * caption String Text des Tasks
 */

function execute(){
    $caption = $_REQUEST['caption'];

// id für neuen Task vergeben
    // aktuelle id aus id_file holen
    $id = file_get_contents('id');
    // id um 1 incrementieren
    $id++;
    // id file speichern
    file_put_contents('id',$id);


 // Task der json liste hinzufügen (id,caption,status => 'offen')
    // Hole die Liste der Tasks
    $taskliste = json_decode(file_get_contents('../_unsichtaber_fuer_vito/tasklist.json'), true);


    //neuen Task anhängen
    $taskliste[] = array(
        "id" => $id,
        "caption" => $caption,
        "status" => "offen"
    );

    //Liste speichern
    file_put_contents('../_unsichtaber_fuer_vito/tasklist.json', json_encode($taskliste));


    // Meldung zurückgeben (id, statustext, aktuelle anzahl der tasks)
    $meldung = array(
        "id" => $id,
        "statustext" => "Task wurde erfolgreich hinzugefügt",
        "counter" => count($taskliste)
    );


    return $meldung;
}