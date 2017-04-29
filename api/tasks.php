<?php
/**
 * Created by PhpStorm.
 * User: veith
 * Date: 29.04.17
 * Time: 11:32
 */

$verb = $_SERVER["REQUEST_METHOD"];

switch ($verb) {
    case 'GET':
        include('alle_tasks.php');
        break;
    case 'POST':
        include('add_task.php');
        break;
    case 'PATCH':
        // hier sind die werte vom patch drinnen
        include('add_task.php');
        $_PATCH = fopen("php://input", "r");
        break;

}

// gib den korrekten header aus
header('content-type: application/json; charset=UTF-8');
echo json_encode(execute());