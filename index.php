<?php
    // including the index.html
    $index = file_get_contents('_index.html');
    echo $index;

    date_default_timezone_set('Europe/Rome');
    $now = date('Y/m/d H:i:s');

    // using the same hof file, using different sections, obvsly
    $json = file_get_contents('hof/data.json');
    $data = json_decode($json, true);
    
    // pushes in the head of the list the $now timestamp
    array_unshift($data["timestamps"], $now);
    // adds one hit counter
    $data["hits"] += 1;

    
    // adding and writing to file
    $added = json_encode($data);
    file_put_contents('hof/data.json', $added);
?>
