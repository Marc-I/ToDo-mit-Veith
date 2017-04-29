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
        include ('add_task.php');
        break;
    case 'PATCH':
        // hier sind die werte vom patch drinnen
     global $_PATCH;
     $_PATCH = fopen("php://input","r");

}

// gib den korrekten header aus
header('content-type: application/json; charset=UTF-8');
echo json_encode(execute());