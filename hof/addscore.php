<?php

    // get hall of fame from data JSON
    $json = file_get_contents('data.json');
    $data = json_decode($json, true);
    $scores = $data["scores"];

    // getting username and final score from the main game and adding to hof (data,score)
    array_push($scores, array('user'=> $_POST['username'], 'score' => $_POST['score']));
    $data["scores"] = $scores;
    
    $newHof = json_encode($data);
    
    // writing hof to file
    file_put_contents('data.json', $newHof);
    
?>