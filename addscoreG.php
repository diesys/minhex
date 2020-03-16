<?php
    
    // hall of fame
    $hof = file_get_contents('hof.json');
    $data = json_decode($hof, true);

    // getting username and final score from the main game and adding to hof
    // $data[$_POST['username']] = $_POST['score'];
    $data[$_GET['username']] = $_GET['score'];
    // var_dump($data);
    $newhof = json_encode($data);
    
    // writing hof to file
    file_put_contents('hof.json', $newhof);

?>