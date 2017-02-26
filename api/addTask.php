<?php
/**
 * Created by PhpStorm.
 * User: marc-iten
 * Date: 25.02.17
 * Time: 11:56
 */

session_start();

$nextID = count($_SESSION['tasks']) + 1;

$newTask = [
        "ID" => $nextID,
        "Caption" => $_POST['Caption'],
        "Status" => 'open'
    ];

if(!isset($_SESSION['tasks']) || !$_SESSION['tasks']){
    $_SESSION['tasks'] = [];
}

$_SESSION['tasks'][] = $newTask;

header('Content-Type: text/html; charset=utf-8');
header('Content-Type: application/json');

echo json_encode($newTask, JSON_UNESCAPED_UNICODE);
