<?php
/**
 * Created by PhpStorm.
 * User: marc-iten
 * Date: 25.02.17
 * Time: 11:56
 */

session_start();

$_SESSION['tasks'][] = [
        "ID" => (count($_SESSION['tasks']) + 1),
        "Caption" => "neu",
        "Status" => "open"
    ];

header('Content-Type: text/html; charset=utf-8');
header('Content-Type: application/json');

echo json_encode($_SESSION['tasks'], JSON_UNESCAPED_UNICODE);
