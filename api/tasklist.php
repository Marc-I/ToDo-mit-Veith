<?php

//sleep(3);

$fp = fopen('tasklist.json', 'rb');

header('Content-Type: application/json');
header('Content-Length: ' . filesize('tasklist.json'));

fpassthru($fp);
exit;
