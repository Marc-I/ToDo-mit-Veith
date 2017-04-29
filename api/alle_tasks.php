<?php
/**
 * Dieses Skript gibt die liste aller nicht gelöschten Tasks aus
 */

/**
 * @return array das Array das nacher in json umgewandelt wird
 */
function execute()
{
// Hole die Liste der Tasks
    $taskliste = json_decode(file_get_contents('../_unsichtaber_fuer_vito/tasklist.json'), true);

    /**
     * Alle tasks die den status deleted haben nicht ausgeben.
     */
    $response = [];

// iteriere durch alle tasks
    foreach ($taskliste as $task) {
        // füge task die nicht den status deleted haben zu $response hinzu .
        if ($task["status"] != "deleted") {
            $response[] = $task;
        }
    }



// gib die liste aus
    return $response;

}