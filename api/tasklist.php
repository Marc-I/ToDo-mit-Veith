<?php

session_start();
//$_SESSION['tasks'] = [
//    [
//        "ID" => 1,
//        "Caption" => "Wäsche waschen",
//        "Status" => "deleted"
//    ],
//    [
//        "ID" => 2,
//        "Caption" => "Küche aufräumen",
//        "Status" => "open"
//    ],
//    [
//        "ID" => 3,
//        "Caption" => "Salz nachfüllen",
//        "Status" => "open"
//    ],
//    [
//        "ID" => 4,
//        "Caption" => "Gemüse kaufen",
//        "Status" => "closed"
//    ],
//    [
//        "ID" => 5,
//        "Caption" => "alle beschriftet",
//        "Status" => "deleted"
//    ]
//];

header('Content-Type: text/html; charset=utf-8');
header('Content-Type: application/json');

echo json_encode($_SESSION['tasks'], JSON_UNESCAPED_UNICODE);
