<?php

session_start();

if (!isset($_SESSION['tasks']) || !$_SESSION['tasks']) {
    $_SESSION['tasks'] = [];
}

if (isset($_POST['Status']) && $_POST['Status']) {
    $result = array_filter($_SESSION['tasks'], function ($e) {
        return $e['Status'] == $_POST['Status'];
    });
} elseif (isset($_GET['Status']) && $_GET['Status']) {
    $result = array_filter($_SESSION['tasks'], function ($e) {
        return $e['Status'] == $_GET['Status'];
    });
} else {
    $result = $_SESSION['tasks'];
}

header('Content-Type: text/html; charset=utf-8');
header('Content-Type: application/json');

echo json_encode(array_values($result), JSON_UNESCAPED_UNICODE);
