// Get arguments

        argv = {}
        window.location.search.substring(1).split('&').forEach(function (c) { var kv = c.split('='); argv[kv[0]] = kv[1] } );


        // General settings  //////////////////////
        //--!!this could be made better
        var
        	N = parseInt(argv["n"]) || 5,
        	//dimension = 12.3,//
            dimension = 12.3/5*N,							// height measured in triangles' size
            BOMBS = parseInt(argv["b"]) || 30;

        var base_clr = "#A9D41C",
            stroke_clr = "rgba(0,0,0,.1)",
            stroke_width = "2";
            // clicked_clr = "#377a01",
            clicked_clr = "#698511";
            over_clr = "#e8ff7d",
            // clicked_clr = "#dbf3fe",
            bomb_clr = "#C10F08",
            bomb2_clr = "#950601",
            flag_clr = "#f8b71b",
            anim_dur = 130;

        var textDimension = 2.1;
            fontColor = "#fff";
            font = 'OpenSansBold';

        ///////////////////////////////////////////
        // Defining the minimum margin for the field inscribed into the page and the margin of the gametable inscribed into the field

        var fieldMargin = .05,
            bodyMarginWidth = .15,
            bodyMarginHeight = .15;

        // (Global)Page size
        var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('field')[0],
        width = (w.innerWidth || e.clientWidth || g.clientWidth),
        height = (w.innerHeight|| e.clientHeight|| g.clientHeight),
        centerX = width / 2,
        centerY = height / 2;

        // Here there's the field definition
        var field = Snap('#field');


        // Calculate and Set the field dimensions
        var hsr3 = (3 ** .5) / 2;

        //  If the body ratio (y/x) is less than hsr3 (the hexagon box ratio, so the field ratio)
        //  then we must fit the field according to the body height deriving the right width,
        //  otherwise we must use the body width.
        if (height/width < hsr3) {
            fieldHeight = height * (1 - 2 * bodyMarginHeight);
            fieldWidth = fieldHeight / hsr3;
        } else {
            fieldWidth = width * (1 - 2 * bodyMarginWidth);
            fieldHeight = fieldWidth * hsr3;
        }

        document.getElementById('field').setAttribute('width',fieldWidth);
        document.getElementById('field').setAttribute('height',fieldHeight);

        // Calculate and set the big hexagon dimensions and position

        //var l = parseInt(centerY*2/dimension),				// triangles' box side
        var l = parseInt(fieldWidth * (1 - 2 * fieldMargin) * .5 / N),
            //m = parseInt(l/18.3);
            m = 0

        //var x0 = centerX - l*N/4*3,
        //	y0 = 0
        var x0 = fieldWidth * .5 * (.5 + fieldMargin),
            y0 = fieldHeight * fieldMargin;


        var doubleClick = {};
        doubleClick.mouseClickDelay = 190;
        doubleClick.lastClickTime = +new Date();
        doubleClick.waitingSndClick = false;
        doubleClick.lastClick = null;

        var fontSize = l*textDimension/110;


        /////////////////////////////////////////////////////////

        // MENU

        var menu = Snap('#menu');

        // CONF
        var menu_hex_points = [ [320,0], [640,0], [800,280], [640,550], [320,550], [160,280]],
            menu_center = [ ( menu_hex_points[1][0] - menu_hex_points[0][0] / 2 ), menu_hex_points[2][1] ],
            menu_hole = menu.circle(menu_center[0], menu_center[1], menu_hex_points[1][0] - menu_hex_points[0][0] + 15).attr({fill: "#fff"}),

            //colors
            menu_play_clr = "#a9d41c",
            menu_hex_clr  = menu_play_clr,
            menu_bomb_clr = "#E61913",
            menu_size_clr = "#F5B10A",
            menu_fame_clr = "#8BAF17",

            menu_hex = menu.polygon(menu_hex_points).attr({fill: menu_hex_clr }),
            menu_play = menu.polygon(menu_hex_points[0], menu_hex_points[1], menu_hex_points[4], menu_hex_points[5]).attr({fill: menu_play_clr }),
            menu_bomb = menu.polygon(menu_center, menu_hex_points[3], menu_hex_points[4]).attr({ fill: menu_bomb_clr }),
            menu_size = menu.polygon(menu_center, menu_hex_points[2], menu_hex_points[3]).attr({ fill: menu_size_clr }),
            menu_fame = menu.polygon(menu_center, menu_hex_points[1], menu_hex_points[2]).attr({ fill: menu_fame_clr }),
            menu_group = menu.group(menu_hex, menu_play, menu_bomb, menu_size, menu_fame).attr({mask: menu_hole});

        var m_text_opt = {'text-anchor':'middle', 'alignment-baseline': 'central'};
            m_text_opt['font-size'] = 3.5 + 'em';
            m_text_opt['font-family'] = 'OpenSansBold';
            m_text_opt['font-weight'] = 600;
            m_text_opt['fill'] = "#fff";

        var m_img_halfsize = 60;
            m_bombs = menu.text(menu_center[0], 1.75 * menu_center[1], "30").attr(m_text_opt),
            m_bomb_icon = menu.image('img/menu/bomb.png', menu_center[0] - m_img_halfsize, 1.25 * menu_center[1]),
            m_size  = menu.text(menu_hex_points[3][0], 1.65 * menu_center[1], "7").attr(m_text_opt),
            m_size_icon = menu.image('img/menu/size.png', menu_hex_points[3][0] - m_img_halfsize, 1.1 * menu_center[1]),
            m_play = menu.text(menu_center[0] - 1.6 * m_img_halfsize, menu_center[1], "PLAY").attr(m_text_opt),
            m_play.attr({fill: "#1f1f1f"}),
            m_play_icon = menu.image('img/menu/play.png', menu_hex_points[5][0] + m_img_halfsize/2, menu_center[1] - m_img_halfsize);


        ////// UI

        //elements

        var menu_play_btn = menu.group(menu_play, m_play, m_play_icon);

        function closemenu() {
          menu_hole.animate({r: 0}, 1000, mina.bounce);
          menu.attr({display: "none"});
        }

        ////////////////////////////////////////////////////////


        function mouseOver () {
            if (this.state == "virgin")
                this.animate({fill: over_clr}, anim_dur, mina.easein);
        }

        function mouseOut () {
            if (this.state == "virgin")
                this.animate({fill: base_clr}, anim_dur, mina.easeout);
        }

        function drawCell (i, j) {
            var hsr3 = Math.sqrt(3)/2;
            var s = l - m;
            var x = x0 + i*l/2,
                y = y0 + j*l*hsr3;
            var triangle;
            var attributes = { fill: base_clr, strokeWidth: stroke_width, stroke: stroke_clr }
            if ((i+j)%2)
                // down-triangle
                triangle = field.polygon(x - s/2 + m*hsr3, y + m/2, x, y + s*hsr3 - m*hsr3, x + s/2 - m*hsr3, y + m/2).attr(attributes);
            else
                // up-triangle
                triangle = field.polygon(x, y + m, x - l/2 + m*hsr3, y + l*hsr3 - m/2, x + l/2 - m*hsr3, y + l*hsr3 - m/2).attr(attributes);

            triangle.pos = [i,j];
            triangle.count = 0;
            triangle.mouseover(mouseOver);
            triangle.mouseout(mouseOut);

            return triangle
        }

        function textOnCell (pos,txt) {
            var x = x0 + pos[0]*l/2,
                y = y0 + pos[1]*l*Math.sqrt(3)/2 + (((pos[0] + pos[1]) % 2) ? 1.15 : 1.85) * l * Math.sqrt(3) / 6;

            var opts = {'text-anchor':'middle', 'alignment-baseline': 'central'};

            opts['font-size'] = fontSize + 'em';
            opts['font-family'] = font;
            opts['font-weight'] = 600;
            opts['fill'] = fontColor;
            return field.text(x,y,txt).attr(opts);
        }

        function Grid (N) {

            this.STARTED = false;
            this.FINISHED = false;
            this.cell = {};
            this.clickedCells = 0;

            this.mouseClick = function (pos) {
                return function () {
                    if (doubleClick.waitingSndClick) {
                        // double click
                        this.grid.toggleFlag(pos);
                        clearTimeout(doubleClick.lastClick);
                        doubleClick.waitingSndClick = false;
                        return
                    }
                    doubleClick.waitingSndClick = true;
                    var f = function () {
                        // single click
                        doubleClick.waitingSndClick = false;
                        this.grid.openCell(pos);
                    };
                    doubleClick.lastClick = setTimeout(f, doubleClick.mouseClickDelay);
                }
            }

            this.openCell = function (pos) {
                if (this.FINISHED)
                        return

                var cell = this.cell[pos];
                if (!this.STARTED) {
                    //this.initialize(pos);
                    this.placeBombs(pos);
                    this.STARTED = true;
                }
                if (cell.state == "virgin") {
                    cell.state = "clicked";
                    this.clickedCells++;
                    if (cell.isBomb) {
                        cell.animate({fill: bomb_clr}, anim_dur, mina.easein);
                        this.FINISHED = true;
                        cell.state = "clicked";
                        setTimeout(function () {alert("Pieces of your fleshy brain are all over the walls. Pay more attention to mines next time")},1000);
                        for (c of Object.keys(this.cell))
                        	if (this.cell[c].isBomb && c != pos) {
                        		this.cell[c].animate({fill: bomb2_clr}, anim_dur, mina.easein);
                                this.cell[c].state = "clicked";
                            }

                        return
                    }
                    cell.animate({fill: clicked_clr}, anim_dur, mina.easein);
                    if (cell.count)
                        textOnCell(cell.pos, cell.count.toString()).click(this.mouseClick(pos));
                    else
                        for (c of cell.nbHood)
                            this.openCell(c);

                } else      // convert to switch?
                    if (cell.state == "clicked") {
                        var placedBombs = 0;
                        for (c of cell.nbHood)
                            if (this.cell[c].state == "flag")
                                placedBombs++;
                        if (placedBombs == cell.count)
                            for (c of cell.nbHood)
                                if (this.cell[c].state == "virgin")
                                    this.openCell(c);
                    }
                this.checkVictory();
            }

            this.checkVictory = function () {
                if (this.clickedCells == 6*N*N)
                    setTimeout(function () {alert("You are a real mine surviver! Good Job")},1000);
            }

            this.toggleFlag = function (pos) {
                    if (this.FINISHED || !this.STARTED)
                        return

                    var cell = this.cell[pos];
                    switch (cell.state) {
                        case "virgin":
                            cell.state = "flag";
                            cell.animate({fill: flag_clr}, anim_dur, mina.easein);
                            this.clickedCells++;
                            break;
                        case "flag":
                            cell.state = "virgin";
                            cell.animate({fill: base_clr}, anim_dur, mina.easeout);
                            this.clickedCells--;
                    }
                    this.checkVictory();
            }

            this.addCell = function (i,j) {
                var c = drawCell(i,j);
                c.isBomb = false;
                c.state = "virgin"                  // virgin, flag, clicked
                c.click(this.mouseClick([i,j]));
                c.grid = this;
                c.nbHood = [];
                this.cell[[i,j]] = c;
            }

            this.nbHoodOf = function (pos) {
                var nbh = [];
                var i = pos[0], j = pos[1];
                for (k of [-2, -1, 1, 2])
                    nbh.push([i+k, j]);
                for (k of [-1, -0, 1])
                    nbh = nbh.concat([[i+k, j-1], [i+k, j+1]]);

                var row
                if ((i+j) % 2) row = -1; else row = 1;
                nbh = nbh.concat([[i-2, j + row], [i+2, j + row]]);

                return nbh
            }


            this.placeBombs = function (firstClick) {
                // exclude the cells next to the first click, so you can start safely
                var toExclude = this.cell[firstClick].nbHood.map(function (x) { return x.toString() });
                toExclude.push(firstClick.toString());
                var candidates = Object.keys(this.cell).filter(function(x) { return toExclude.indexOf(x) == -1 });
                for (var b = 0; b < BOMBS; b++) {
                    var choiceInd = Math.floor(Math.random()*candidates.length);
                    var bomb = this.cell[candidates[choiceInd]]
                    bomb.isBomb = true;
                    for (nextToBomb of bomb.nbHood)
                        this.cell[nextToBomb].count++;
                    candidates.splice(choiceInd,1);
                }
            }

            function coords(c) {
                return c.split(",").map(parseFloat);
            }

                // adding the cells to the grid
                for (var j = 0; j < N; j++)
                    for (var i = -j; i < 2*N+j+1; i++)
                        this.addCell(i,j);
                for (var j = N; j < 2*N; j++)
                    for (var i = j+1-2*N; i < 4*N-j; i++)
                        this.addCell(i,j);

                // calculating the neighborhood for each cells and saving it
                var cellCoords = Object.keys(this.cell);
                for (c of cellCoords)
                    this.cell[c].nbHood = this.nbHoodOf(coords(c)).filter( function (nbh) { return cellCoords.indexOf(nbh.toString()) != -1 } );

      }


// test code
var grid = new Grid(N);