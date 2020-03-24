<!DOCTYPE html>
<html>

<head>
    <title>MinHex | Hall of Fame</title>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="Description" content="MinHex is spin-off of the old glory Mines, made with an hexagonal lattice instead. With modern UI made with Snap.svg | Hall of Fame">
    
    <!-- MinHex style -->
    <link rel="stylesheet" href="style.css">
    <!-- <link rel="stylesheet" href="style.min.css"> -->

    <!-- Mobile Specifics -->
    <link rel="manifest" href="manifest.json">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="HandheldFriendly" content="true"/>
    <meta name="MobileOptimized" content="320"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=0.5 maximum-scale=1.0">

    <!-- Colors and bars -->
    <!-- Chrome, Firefox OS and Opera -->
    <!-- <meta name="theme-color" content="#1B0D09"> -->
    <meta name="theme-color" content="#140906">

    <!-- Windows Phone -->
    <meta name="msapplication-navbutton-color" content="#140906">

        <!-- Apple bar specific -->
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

        <!-- Favicon -->
        <link rel="icon" href="img/favicon72.png" type="image/x-icon">
        <link rel="shortcut icon" href="#">

        <link rel="icon" sizes="114x114" href="img/favicon114.png" type="image/x-icon">
        <link rel="icon" sizes="72x72" href="img/favicon72.png" type="image/x-icon">
        <link rel="icon" sizes="144x144" href="img/favicon144.png" type="image/x-icon">
        <link rel="icon" sizes="256x256" href="img/favicon256.png" type="image/x-icon">

        <!-- Apple favicon -->
        <link rel="apple-touch-icon" sizes="114x114" href="img/favicon114.png" type="image/x-icon">
        <link rel="apple-touch-icon" sizes="72x72" href="img/favicon72.png" type="image/x-icon">
        <link rel="apple-touch-icon" sizes="144x144" href="img/favicon144.png" type="image/x-icon">
        <link rel="apple-touch-icon" sizes="256x256" href="img/favicon256.png" type="image/x-icon">

    </head>

    <body class="flexBody">

        <header>
            <img src="img/hof_cup.png" height="100" width="100" alt="MinHex cup" />
            <h1>Hall of Fame</h1> 
            <img src="img/icon.png" height="100" width="100" alt="MinHex logo" />
        </header>
                
        <table id="hof_table">
            <tr>
                <th>user</th>
                <th>score</th>
                <!-- <th>time</th> -->
            </tr>
            <?php 
                // get hall of fame JSON
                $hof = file_get_contents('hof.json');
                $data = json_decode($hof, true);
                // sorts the hof
                arsort($data);

                foreach ($data as $user => $score):
            ?>
            <tr>
                <td><?php echo $user; ?></td>
                <td><?php echo $score; ?></td>
                <!-- <td> -->
                    <?php// echo $row[2]; ?>
                <!-- </td> -->
            </tr>
            <?php endforeach; ?>
        </table>

    </body>

</html>