<?php

session_start();

if (!isset($_SESSION['tasks']) || !$_SESSION['tasks']) {
    $_SESSION['tasks'] = [];
}

if (isset($_POST['ID']) && $_POST['ID']) {
    $result = array_filter($_SESSION['tasks'], function ($e) {
        return $e['ID'] == $_POST['ID'];
    });
} elseif (isset($_GET['ID']) && $_GET['ID']) {
    $result = array_filter($_SESSION['tasks'], function ($e) {
        return $e['ID'] == $_GET['ID'];
    });
}

header('Content-Type: text/html; charset=utf-8');
header('Content-Type: application/json');

echo json_encode(array_values($result)[0], JSON_UNESCAPED_UNICODE);
