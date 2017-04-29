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
}

// gib den korrekten header aus
header('content-type: application/json; charset=UTF-8');
echo json_encode(execute());