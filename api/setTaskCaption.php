<?php
/**
 * Created by PhpStorm.
 * User: marc-iten
 * Date: 26.02.17
 * Time: 16:31
 */

$id = 0;
$caption = '';

if (isset($_POST['ID']) && $_POST['ID']) {
    $id = $_POST['ID'];
}

if (isset($_GET['ID']) && $_GET['ID']) {
    $id = $_GET['ID'];
}

if (isset($_POST['Caption']) && $_POST['Caption']) {
    $caption = $_POST['Caption'];
}

if (isset($_GET['Caption']) && $_GET['Caption']) {
    $caption = $_GET['Caption'];
}

if ($id == 0 || $caption == '') {
    exit;
}

session_start();

if (!isset($_SESSION['tasks']) || !$_SESSION['tasks']) {
    $_SESSION['tasks'] = [];
}

$column = array_column($_SESSION['tasks'], 'ID');
$key = array_search($id, $column);

$_SESSION['tasks'][$key]['Caption'] = $caption;

header('Content-Type: text/html; charset=utf-8');
header('Content-Type: application/json');

echo json_encode($_SESSION['tasks'][$key], JSON_UNESCAPED_UNICODE);
