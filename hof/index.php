<!DOCTYPE html>
<html>

<head>
    <title>MinHex | Albo d'oro</title>

    <meta charset="utf-8">
    <!-- <meta name="Description" content="MinHex is spin-off of the old glory Mines, made with an hexagonal lattice instead. With modern UI made with Snap.svg"> -->
    <meta name="Description" content="MinHex è una rivisitazione della vecchia gloria 'Campo Minato'/'Prato Fiorito', fatto sul reticolo esagonale. Creato con Snap.svg e una moderna esperienza utente.">
    <meta name="keywords" content="HTML,CSS,JavaScript,Snap.Svg,Game,Mines,JS,Prato fiorito,Campo minato,bombe,arcade,videogame,opensource,freesoftware,GPL">
    <meta name="author" content="Nunzio e Diego Turtulici">

    <!-- MinHex style -->
    <!-- <link rel="stylesheet" href="style.css"> -->
    <link rel="stylesheet" href="../css/style.min.css">

    <!-- Mobile Specifics -->
    <link rel="manifest" href="../manifest.json">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="HandheldFriendly" content="true"/>
    <meta name="MobileOptimized" content="320"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=0.5 maximum-scale=1.0">

    <!-- Colors and bars -->
    <!-- Chrome, Firefox OS and Opera -->
    <!-- <meta name="theme-color" content="#1B0D09"> -->
    <meta name="theme-color" content="#000">

    <!-- Windows Phone -->
    <meta name="msapplication-navbutton-color" content="#000">

        <!-- Apple bar specific -->
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

        <!-- Favicon -->
        <link rel="icon" href="../img/favicon72.png" type="image/x-icon">
        <link rel="shortcut icon" href="#">

        <link rel="icon" sizes="114x114" href="../img/favicon114.png" type="image/x-icon">
        <link rel="icon" sizes="72x72" href="../img/favicon72.png" type="image/x-icon">
        <link rel="icon" sizes="144x144" href="../img/favicon144.png" type="image/x-icon">
        <link rel="icon" sizes="256x256" href="../img/favicon256.png" type="image/x-icon">

        <!-- Apple favicon -->
        <link rel="apple-touch-icon" sizes="114x114" href="../img/favicon114.png" type="image/x-icon">
        <link rel="apple-touch-icon" sizes="72x72" href="../img/favicon72.png" type="image/x-icon">
        <link rel="apple-touch-icon" sizes="144x144" href="../img/favicon144.png" type="image/x-icon">
        <link rel="apple-touch-icon" sizes="256x256" href="../img/favicon256.png" type="image/x-icon">

    </head>

    <body class="flexBody">

        <header>
            <div>    
                <img src="../img/hof_cup.png" height="75" width="75" alt="MinHex cup" />
                <h1>Albo d'oro</h1> 
                <img src="../img/logo.png" height="75" width="75" alt="MinHex logo" />
            </div>
        </header>
        
        <div class="chart" id="chart">
            <div id="days">
                <!-- <h3>Visite giornaliere</h3> -->
            </div>
            <center><p>Partite giornaliere</p></center>
        </div>
        <!-- <div id="viz1"></div> -->
        
               
        <table id="hof_table">
            <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Punti</th>
                <!-- <th>time</th> -->
            </tr>
            <?php 
                // get hall of fame from data JSON
                $json = file_get_contents('data.json');
                $data = json_decode($json, true);
                $hof = $data["scores"];
                $hits = json_encode($data["timestamps"]);
                
                // user-defined comparison ascending sort by score
                function hof_sort(array $a, array $b) {
                    if ($a['score'] == $b['score']) {
                        return 0;
                    } else {
                        return ($a['score'] > $b['score'])? -1:1;
                    }
                }
                // Sort el of the array by prev function
                usort($hof, "hof_sort");

                // prints the hof
                // inizial position: 1
                $position = 1;
                foreach ($hof as $entry):
            ?>
            <tr>
                <td><?php echo $position; $position++; ?></td>
                <td><?php if ($entry['user'] != "") echo $entry['user']; else echo '   - - - - -   ' ;?></td>
                <td><?php echo $entry['score']; ?></td>
            </tr>
            <?php endforeach;?>
        </table>


        <script src="../js/rough-viz@1.0.6.min.js"></script>
        <script>
            var timestamps = <?php echo $hits ?>;
 
            daysArray = timestamps.map(ts => ts.substr(0,10))
            daysMap = {}
            daysArray.map(day => daysMap[day] = (daysMap[day] || 0) + 1)
            labels = Object.keys(daysMap).sort().reverse()
            values = labels.map(k => daysMap[k])
            window.innerWidth < 800 ? window.innerWidth *= .85 : window.innerWidth *= .45            
            
            // create Bar chart from csv file, using default options
            new roughViz.BarH({
                element: '#days', // container selection
                roughness: 1,
                bowing: 2,
                color: 'white',
                stroke: 'orange',
                strokeWidth: .7,
                fillStyle: 'hatchure',
                // fillStyle: 'dashed',
                // title: 'Visite giornaliere',
                interactive: false,
                fillWeight: .4,
                width: window.innerWidth,
                height: window.innerHeight*.8,
                data: {
                    labels: labels,
                    values: values
                    // labels: labels.concat(labels),
                    // values: values.concat(values)
                },
                labels: 'flavor',
                values: 'price'
            });
            // new roughViz.Line({
            //     element: '#viz1', // container selection
            //     roughness: 1,
            //     y1: 'revenue',
            //     y2: 'cost',
            //     // y3: 'profit',
            //     colors: ['orange','white'],
            //     strokeWidth: 1,
            //     stroke: 'white',
            //     // fillStyle: 'zigzag',
            //     // fillWeight: 1,
            //     data: 'https://raw.githubusercontent.com/jwilber/random_data/master/profits.csv',
            //     // labels: 'flavor',
            //     // values: 'price'
            // });
        </script>

        <a class="button playagain" href="../">Gioca!</a>

    </body>

</html>