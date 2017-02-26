<?php
/**
 * Created by PhpStorm.
 * User: marc-iten
 * Date: 26.02.17
 * Time: 13:22
 */

$id = 0;
$status = '';

if (isset($_POST['ID']) && $_POST['ID']) {
    $id = $_POST['ID'];
}

if (isset($_GET['ID']) && $_GET['ID']) {
    $id = $_GET['ID'];
}

if (isset($_POST['Status']) && $_POST['Status']) {
    $status = $_POST['Status'];
}

if (isset($_GET['Status']) && $_GET['Status']) {
    $status = $_GET['Status'];
}

if ($id == 0 || $status == '') {
    exit;
}

session_start();

if (!isset($_SESSION['tasks']) || !$_SESSION['tasks']) {
    $_SESSION['tasks'] = [];
}

$column = array_column($_SESSION['tasks'], 'ID');
$key = array_search($id, $column);

$_SESSION['tasks'][$key]['Status'] = $status;

header('Content-Type: text/html; charset=utf-8');
header('Content-Type: application/json');

echo json_encode($_SESSION['tasks'][$key], JSON_UNESCAPED_UNICODE);
