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
    // Überprüfen der eingehenden Werte (ID, Caption, Status)
        // eventuelle Fehlermeldung senden (400)

    // Task den wir bearbeiten wollen holen/laden/abrufen ($task)
        // eventuelle Fehlermeldung senden (falls der Task nicht existiert) (404)

    // Task mit den übergebenen Werten aktualisieren (Caption,Status)

    // Task Speichern
        // eventuellen Fehler senden wenn der Speichervorgang nicht geklappt hat (500)


    // Meldung/Antwort senden wenn alles geklappt hat.

}


//$_PATCH = fopen("php://input", "r");