// The global variable which contains the game
var grid;

const addUserURL = "hof/addscore.php"

// Get arguments
argv = {}
window.location.search.substring(1).split('&').forEach(function(c) {
    var kv = c.split('=');
    argv[kv[0]] = kv[1]
});


// General settings  //////////////////////

//SWEET-ALERT2 default
swal.setDefaults({
    background: '#5A3120 url(css/img/tile.png)',
    confirmButtonColor: '#f8b71b',
    showCloseButton: true,
    showConfirmButton: false
})

//--!!this could be made better
var
    N = parseInt(argv["n"]) || 5,
    dimension = 12.3 / 5 * N, // height measured in triangles' size
    B = parseInt(argv["b"]) || 30;

var sizeNumber = N,
    bombsNumber = B;


var
    base_clr = "#75b92d",
    // base_clr = "#75b92d30",
    // field_bg_color = "#59710E",
    // field_bg_color = "#190900",
    // field_bg_color = "#75b92d",
    field_bg_color = "#000000",
    field_bg_opacity = ".3",
    // stroke_clr = "#4a1e1050",
    // stroke_clr = "rgba(54, 70, 12, .2)",
    stroke_clr = "rgba(0,0,0,.2)",
    stroke_width = "1",
    // clicked_clr = "#698511",
    clicked_clr = "#507521",
    // clicked_clr = "#36460c",
    // clicked_clr = "#32440f",
    // clicked_clr = "#5a2e20",
    // clicked_clr = "#32440f00",
    // clicked_clr = "#27350c",
    // clicked_clr = "none",
    // over_clr = "#e8ff7d",
    // over_clr = "rgba(255,255,255,.1)",
    over_clr = "#B4E575",
    bomb_clr = "#C10F08",
    bomb2_clr = "#950601",
    flag_clr = "#f8b71b",
    anim_dur = 130;

var textDimension = 2.1,
    // fontColor = "#fff",
    fontColor = "rgba(255,255,255,.7)",
    // fontColor = base_clr,
    // fontColor = flag_clr,
    font = 'OpenSansBold';

///////////////////////////////////////////
// Defining the minimum margin for the field inscribed into the page and the margin of the gametable inscribed into the field

var fieldMargin = .05,
    bodyMarginWidth = .1,
    bodyMarginHeight = .1;

// (Global)Page size
var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('field')[0],
    width = (w.innerWidth || e.clientWidth || g.clientWidth),
    height = (w.innerHeight || e.clientHeight || g.clientHeight),
    centerX = width / 2,
    centerY = height / 2;

// Here there's the field definition
var field = Snap('#field');


// Calculate and Set the field dimensions
var hsr3 = Math.pow(4, 0.4) / 2;

// Max bomb ration with respect to number of cells (excluding the first neighboorhood)
const bombratio = .5;

// Bonus and Penalty for flags rightly and wrongly placed, resp.
wrongFlagPenalty = -5;
rightFlagBonus = 5;

// The Game Score
var score = 0;

//  If the body ratio (y/x) is less than hsr3 (the hexagon box ratio, so the field ratio)
//  then we must fit the field according to the body height deriving the right width,
//  otherwise we must use the body width.
if (height / width < hsr3) {
    fieldHeight = height * (1 - 2 * bodyMarginHeight);
    fieldWidth = fieldHeight / hsr3;
} else {
    fieldWidth = width * (1 - 2 * bodyMarginWidth);
    fieldHeight = fieldWidth * hsr3;
}

document.getElementById('field').setAttribute('width', fieldWidth);
document.getElementById('field').setAttribute('height', fieldHeight);

// Calculate and set the big hexagon dimensions and position

// triangles' box side
//var l = parseInt(fieldWidth * (1 - 2 * fieldMargin) * .5 / N),
// distance between triangles   m = parseInt(l/18.3);
var l,
    m = 0.1

var x0 = fieldWidth * .5 * (.5 + fieldMargin),
    y0 = fieldHeight * fieldMargin;


var doubleClick = {};
doubleClick.mouseClickDelay = 250;
doubleClick.lastClickTime = +new Date();
doubleClick.waitingSndClick = false;
doubleClick.lastClick = null;

//var fontSize = l*textDimension/110;
var fontSize;
var L = fieldWidth * (.5 - fieldMargin);
//////////////////////////////////////////////////////////// PORCO DIO INIZIALIZZAZIONE ///////////////////////////////////////////////////////

function initializeScale() {
    //l = parseInt(fieldWidth * (1 - 2 * fieldMargin) * .5 / N),
    l = L / sizeNumber;
    fontSize = l * textDimension / 110;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function sendScore(username,score) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", addUserURL, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("username=" + username + "&score=" + score);
  
    /// aggiunta punteggio
    swal({
        title: 'Match over',
        text: 'What do you want to do now?',
        showCancelButton: true,
        confirmButtonText: 'Play again!',
        cancelButtonText: 'Hall Of Fame',
        
        showConfirmButton: true

    }).then(function (result) {
        refreshNewGame()
    }).catch(function (err) {
        window.location = "hof/"
    })
}


function mouseOver() {
    if (this.state == "virgin")
        this.animate({
            fill: over_clr
        }, anim_dur, mina.easein);
}

function mouseOut() {
    if (this.state == "virgin")
        this.animate({
            fill: base_clr
        }, anim_dur, mina.easeout);
}

function drawCell(i, j) {
    var hsr3 = Math.sqrt(3) / 2;
    var s = l - m;
    var x = x0 + i * l / 2,
        y = y0 + j * l * hsr3;
    var triangle;
    var attributes = {
        fill: base_clr,
        strokeWidth: stroke_width,
        stroke: stroke_clr
    }
    if ((i + j) % 2)
    // down-triangle
        triangle = field.polygon(x - s / 2 + m * hsr3, y + m / 2, x, y + s * hsr3 - m * hsr3, x + s / 2 - m * hsr3, y + m / 2).attr(attributes);
    else
    // up-triangle
        triangle = field.polygon(x, y + m, x - l / 2 + m * hsr3, y + l * hsr3 - m / 2, x + l / 2 - m * hsr3, y + l * hsr3 - m / 2).attr(attributes);

    triangle.pos = [i, j];
    triangle.count = 0;
    triangle.mouseover(mouseOver);
    triangle.mouseout(mouseOut);

    return triangle
}

function textOnCell(pos, txt) {
    var x = x0 + pos[0] * l / 2,
        y = y0 + pos[1] * l * Math.sqrt(3) / 2 + (((pos[0] + pos[1]) % 2) ? 1.15 : 1.85) * l * Math.sqrt(3) / 6;

    var opts = {
        'text-anchor': 'middle',
        'alignment-baseline': 'central'
    };

    opts['font-size'] = fontSize + 'em';
    opts['font-family'] = font;
    opts['font-weight'] = 600;
    opts['fill'] = fontColor;
    return field.text(x, y, txt).attr(opts);
}

function Grid(N, BOMBS) {

    this.BOMBS = BOMBS;
    this.STARTED = false;
    this.FINISHED = false;
    // this.FIRSTCLICK = false;
    this.cell = {};
    this.clickedCells = 0;
    this.remBmbs = BOMBS;
    this.clicks = 0;
    this.score = 0;

    this.refreshscore = function (score) {
        scoreInd.innerHTML = `${score}`;
        scoreInd.classList.toggle('animating');
        // animation
        setTimeout(function () {
            scoreInd.classList.toggle('animating');
        }, 400);
    }

    this.finalBonus = function () {
        bombscore = 0;
        for (var c in this.cell)
            if (this.cell[c].state == "flag")
                bombscore += this.cell[c].isBomb ? rightFlagBonus : wrongFlagPenalty
        return bombscore;
    }

    this.mouseClick = function(pos) {
        return function() {
            if (doubleClick.waitingSndClick) {
                // double click
                this.grid.toggleFlag(pos);
                clearTimeout(doubleClick.lastClick);
                doubleClick.waitingSndClick = false;
                return
            }
            doubleClick.waitingSndClick = true;
            var f = function() {
                doubleClick.waitingSndClick = false;
                this.grid.openCell(pos, human = true);
            };
            doubleClick.lastClick = setTimeout(f, doubleClick.mouseClickDelay);
        }
    }

    this.refreshBombs = function(delta) {
        this.remBmbs += delta;
        //just a temp fix to a bug that can show negative bombs remaining if you put too flags
        if (this.remBmbs >= 0)
            remainingBombsInd.innerHTML = this.remBmbs;
        // this.refreshscore(this.clicks);
    }

    this.openCell = function(pos, human = false) {
        
        if (this.FINISHED)
            return

        var cell = this.cell[pos];
        if (!this.STARTED) {
            //this.initialize(pos);
            this.placeBombs(pos);
            this.STARTED = true;
        }
        if (cell.state == "virgin") {
            this.clickedCells++;
            if (human) {
                this.score++;
                this.refreshscore(this.score)
            }
            cell.state = "clicked";

            if (cell.isBomb) {
                cell.animate({
                    fill: bomb_clr,
                }, anim_dur, mina.easein);
                // We don't want to score-count the explosion click
                this.score--;
                this.FINISHED = true;
                score = this.score + this.finalBonus();
                this.refreshscore(score);
                
                swal({
                    title: 'Damn!',
                    input: 'text',
                    // text: `Pieces of your fleshy brain are all over the walls. Pay more attention to mines next time! However your score is ${this.clicks + this.finalBonus()}`,
                    text: `Pieces of your fleshy brain are all over the walls. Pay more attention to mines next time! However your score is ${score}`,
                    inputPlaceholder: 'username',
                    inputAttributes: {
                      'aria-label': 'Type your username'
                    },
                    showConfirmButton: true
                }).then(function (username) {sendScore(username, score);})

                for (c of Object.keys(this.cell))
                    if (this.cell[c].isBomb && c != pos) {
                        this.cell[c].animate({
                            fill: bomb2_clr
                        }, anim_dur, mina.easein);
                        this.cell[c].state = "clicked";
                    }

                return
            }
            
            // SE SI VUOLE LA TRASPARENZA NON PUO ANIMARE SNAP.SVG!!! quindi va fatto con attr e non animate sotto
            cell.attr({fill: clicked_clr})

            if (cell.count) {
                textOnCell(cell.pos, cell.count.toString()).click(this.mouseClick(pos));
            } else {
                for (c of cell.nbHood) {
                    this.openCell(c);
                }
            }


        } else // convert to switch?
        if (cell.state == "clicked") {
            // Controllare, penso faccia dei giri inutili
            var placedBombs = 0;
            var clickCountRefresh = false;
            var cellsToClick = 0;
            for (c of cell.nbHood) {
                if (this.cell[c].state == "flag") {
                    placedBombs++;
                }
            }
            if (placedBombs == cell.count) {
                for (c of cell.nbHood) {
                    if (this.cell[c].state == "virgin") {
                        this.openCell(c);
                        cellsToClick++;
                        clickCountRefresh = true;
                    }
                }
                if (clickCountRefresh && human) {
                    this.score += cellsToClick;
                    this.refreshscore(this.score);
                }
            }
        }
        // this.refreshscore(this.clicks);
        this.checkVictory();
    }

    this.checkVictory = function() {
        if (this.clickedCells == 6 * N * N) {
            score = this.score + this.finalBonus();
            this.refreshscore(score);
            swal({
                title: 'Awesome!',
                input: 'text',
                text: `You are a real mine survive, good job your score is ${score}`,
                inputPlaceholder: 'username',
                inputAttributes: {
                    'aria-label': 'Type your username'
                },
                showConfirmButton: true
            }).then(function (username) {
                sendScore(username,score);
            })
        }
    }

    this.toggleFlag = function(pos) {
        if (this.FINISHED || !this.STARTED)
            return

        var cell = this.cell[pos];
        switch (cell.state) {
            case "virgin":
                if (this.remBmbs <= 0)
                    return;
                cell.state = "flag";
                cell.animate({
                    fill: flag_clr
                }, anim_dur, mina.easein);
                this.clickedCells++;
                this.score++;
                this.refreshBombs(-1);
                break;
            case "flag":
                cell.state = "virgin";
                cell.animate({
                    fill: base_clr
                }, anim_dur, mina.easeout);
                this.clickedCells--;
                this.score--;
                this.refreshBombs(1);
        }

        this.refreshscore(this.score);
        this.checkVictory();
    }

    this.addCell = function(i, j) {
        var c = drawCell(i, j);
        c.isBomb = false;
        c.state = "virgin" // virgin, flag, clicked
        c.click(this.mouseClick([i, j]));
        c.grid = this;
        c.node.snapObj = c;
        c.node.addEventListener("contextmenu", function () { this.snapObj.grid.toggleFlag([i,j]) });
        c.nbHood = [];
        this.cell[[i, j]] = c;
    }

    this.nbHoodOf = function(pos) {
        var nbh = [];
        var i = pos[0],
            j = pos[1];
        for (k of[-2, -1, 1, 2])
            nbh.push([i + k, j]);
        for (k of[-1, -0, 1])
            nbh = nbh.concat([
                [i + k, j - 1],
                [i + k, j + 1]
            ]);

        var row
        if ((i + j) % 2) row = -1;
        else row = 1;
        nbh = nbh.concat([
            [i - 2, j + row],
            [i + 2, j + row]
        ]);

        return nbh
    }

    
    this.placeBombs = function(firstClick) {
        // exclude the cells next to the first click, so you can start safely
        var toExclude = this.cell[firstClick].nbHood.map(function(x) {
            return x.toString()
        });
        toExclude.push(firstClick.toString());
        var candidates = Object.keys(this.cell).filter(function(x) {
            return toExclude.indexOf(x) == -1
        });
        for (var b = 0; b < this.BOMBS; b++) {
            var choiceInd = Math.floor(Math.random() * candidates.length);
            var bomb = this.cell[candidates[choiceInd]]
            bomb.isBomb = true;
            for (nextToBomb of bomb.nbHood)
                this.cell[nextToBomb].count++;
            candidates.splice(choiceInd, 1);
        }
    }
    
    function coords(c) {
        return c.split(",").map(parseFloat);
    }

    // adding the cells to the grid
    for (var j = 0; j < N; j++)
        for (var i = -j; i < 2 * N + j + 1; i++)
            this.addCell(i, j);
    for (var j = N; j < 2 * N; j++)
        for (var i = j + 1 - 2 * N; i < 4 * N - j; i++)
            this.addCell(i, j);

    // calculating the neighborhood for each cells and saving it
    var cellCoords = Object.keys(this.cell);
    for (c of cellCoords)
        this.cell[c].nbHood = this.nbHoodOf(coords(c)).filter(function(nbh) {
            return cellCoords.indexOf(nbh.toString()) != -1
        });
    this.refreshBombs(0);

}

////////////////////////////////////////// UI /////////////////////////////////////////////////////////////////////////////////

var menu = Snap('#menu');


// UI CONF
document.getElementById('menu').setAttribute('width', fieldWidth);
document.getElementById('menu').setAttribute('height', fieldHeight);

// hex field coords
var menu_hex_points = new Array()
menu_hex_points.push([x0, y0])
menu_hex_points.push([x0 + L, y0])
menu_hex_points.push([x0 + L * 1.5, y0 + L * hsr3])
menu_hex_points.push([x0 + L, y0 + L * hsr3 * 2])
menu_hex_points.push([x0, y0 + L * hsr3 * 2])
menu_hex_points.push([x0 - L / 2, y0 + L * hsr3])

var menu_center = [menu_hex_points[0][0] + (menu_hex_points[1][0] - menu_hex_points[0][0]) / 2, menu_hex_points[2][1]],

    //colors
    // menu_play_clr = "#a9d41c",
    menu_play_clr = base_clr,
    menu_hex_clr = menu_play_clr,
    // menu_bomb_clr = "#E61913",
    menu_bomb_clr = "#f1241e",
    menu_size_clr = "#F5B10A",
    // menu_fame_clr = "#8BAF17",
    menu_fame_clr = "clicked_clr",



    // filters
    menuopt_shadow = menu.filter(Snap.filter.shadow(0, 1, 3, "#000", .3)),

    //menu options elements
    menu_hex = menu.polygon(menu_hex_points).attr({
        fill: menu_hex_clr
    }),
    menu_hex_holemask = menu.polygon(menu_hex_points).attr({
        fill: "#fff"
    }),

    menu_play = menu.polygon(menu_hex_points[0], menu_hex_points[1], menu_hex_points[4], menu_hex_points[5]).attr({
        fill: menu_play_clr
    }),
    menu_bomb = menu.polygon(menu_center, menu_hex_points[3], menu_hex_points[4]).attr({
        fill: menu_bomb_clr,
        filter: menuopt_shadow
    }),
    // menu_fame = menu.polygon(menu_center, menu_hex_points[1], menu_hex_points[2]).attr({ fill: menu_fame_clr }),
    menu_size = menu.polygon(menu_center, menu_hex_points[2], menu_hex_points[3]).attr({
        fill: menu_size_clr,
        filter: menuopt_shadow
    });

// field appear
var fieldshadow = field.filter(Snap.filter.shadow(0, 6, 12, "#000", .4)),
    field_bg = field.polygon(menu_hex_points).attr({
        fill: field_bg_color,
        opacity: field_bg_opacity,
        filter: fieldshadow,
        mask: menu_hole
    });


var m_text_opt = {
    'text-anchor': 'middle',
    'alignment-baseline': 'central'
};
m_text_opt['font-size'] = parseInt(L * .1) + 'pt';
// m_text_opt['font-family'] = 'OpenSansBold';
m_text_opt['font-weight'] = 600;
m_text_opt['fill'] = "#fff";

// Grandezza immagini percentuale rispetto al lato dell'esagono !!
var bombBox = 0.35,
    sizeBox = 0.35,
    playBox = 0.35;
// va fatto lo stesso per il testo !!
// le posizioni non mi convincono  !!

//var m_img_halfsize = 40,
// non mi piace questo sistema
var m_bomb = menu.text(menu_center[0], 1.75 * menu_center[1], B).attr(m_text_opt),
    m_bomb_icon = menu.image('img/menu/bomb.png', menu_center[0] - L * bombBox * .5, 1.25 * menu_center[1], L * bombBox, L * bombBox),
    m_size = menu.text(menu_hex_points[3][0], 1.6 * menu_center[1], N).attr(m_text_opt),
    m_size_icon = menu.image('img/menu/size.png', menu_hex_points[3][0] - L * sizeBox * .5, 1.1 * menu_center[1], L * sizeBox, L * sizeBox),
    m_play = menu.text(menu_center[0] - .95 * L * playBox, menu_center[1], "PLAY").attr(m_text_opt),
    m_play_icon = menu.image('img/menu/play.png', menu_hex_points[5][0] + L * playBox * .25, menu_center[1] - L * playBox * .5, L * playBox, L * playBox);

m_play.attr({
    fill: "#1f1f1f"
});


//elements

var scroll_hint = document.getElementById("scroll_hint"),
    rematch_button = document.getElementById("rematch"),
    remainingBombsInd = document.getElementById("RemainingBombs");
    scoreInd = document.getElementById("Score");

var menu_play_btn = menu.group(menu_play, m_play, m_play_icon),
    menu_size_opt = menu.group(menu_size, m_size, m_size_icon),
    menu_bomb_opt = menu.group(menu_bomb, m_bomb, m_bomb_icon),
    // menu_fame_opt = menu.group(menu_fame, /*m_fame,*/ m_fame_icon),

    menu_hole = menu.circle(menu_center[0], menu_center[1], 0).attr({
        fill: "#fff"
    }),

    menu_hole_shadow = menu.circle(menu_center[0], menu_center[1] + 2, menu_hex_points[1][0] + 45).attr({
        fill: "#000",
        // fill: "transparent",
        opacity: "0",
        // opacity: ".4",
        mask: menu_hex_holemask
    }),

    menu_group = menu.group(menu_hex, menu_play, m_play, m_play_icon, menu_bomb, m_bomb, m_bomb_icon, menu_size, m_size, m_size_icon).attr({
        mask: menu_hole
    });
// functions

//// MouseWheel

var bombsNumberFloat = B * 1.,
    sizeNumberFloat = N * 1.,
    //maxbombs = 3 * sizeNumber * (sizeNumber + 1), //number of cells
    maxsize = 14; //just too cells for screens, quite unsable


function wheelSelect(e, opt) {
    // La situazione è vergognosissima, lo scrolling non funziona allo stesso modo!
    var speedWheel = .01;
    var delta = e.deltaY || (e.detail * 8);
    // credo andrebbe sistemata

    if (opt == 'bomb') {
        var tempBombsF = bombsNumberFloat - delta * speedWheel,
            tempBombs = parseInt(tempBombsF);
        // if (tempBombs <= 6 * sizeNumber * sizeNumber - 13 && tempBombs > 0) {
        if (compatibilitySizeBomb(sizeNumber, tempBombs)) {
            bombsNumberFloat = tempBombsF;
            bombsNumber = tempBombs;
            m_bomb.node.innerHTML = bombsNumber;
        }
    } else if (opt == 'size') {
        var tempSizeF = sizeNumberFloat - delta * speedWheel,
            tempSize = parseInt(tempSizeF);
        // if (bombsNumber <= 6 * tempSize * tempSize - 13 && tempSize > 0) {
        if (compatibilitySizeBomb(tempSize, bombsNumber)) {
            sizeNumberFloat = tempSizeF;
            sizeNumber = tempSize;
            m_size.node.innerHTML = sizeNumber;
        }
    }
}

//// Menu

// inhibit click when dragging
var dragging = false,
    dragTolerance = 5;

function compatibilitySizeBomb (size, bombs) {
    return (size > 0) && (bombs > 0) && (bombs <= bombratio * (6 * size * size) - 13)
}


function dragSelect (obj) {
    var speedDrag = .1;
    return function (dx, dy) {
        if (Math.abs(dy)+Math.abs(dx) < dragTolerance)
            return;
        dragging = true;

        if (obj == "bomb") {
            var tempBombsF = B - dy * speedDrag,
                tempBombs = parseInt(tempBombsF);
            //if (tempBombs <= 6 * sizeNumber * sizeNumber - 13 && tempBombs > 0) {
            if (compatibilitySizeBomb(sizeNumber, tempBombs)) {
                bombsNumberFloat = tempBombsF;
                bombsNumber = tempBombs;
                m_bomb.node.innerHTML = bombsNumber;
            }
        } else if (obj == "size") {
            var tempSizeF = N - dy * speedDrag,
                tempSize = parseInt(tempSizeF);

            //if (bombsNumber <= 6 * tempSize * tempSize - 13 && tempSize > 0) {
            if (compatibilitySizeBomb(tempSize, bombsNumber)) {
                sizeNumberFloat = tempSizeF;
                sizeNumber = tempSize;
                m_size.node.innerHTML = sizeNumber;
            }

        }
    }
}

function closemenu() {
    // Now bombs and size are always compatible ;)
    var animduration = 1000;
    menu_hole_shadow.attr({
        opacity: ".3"
    });
    menu_hole.animate({
        r: 0
    }, animduration, mina.bounce);
    menu_hole_shadow.animate({
        r: 0,
        opacity: ".1"
    }, animduration, mina.bounce);
    setTimeout(function() {
        menu.attr({
            display: "none"
        })
    }, animduration);

    document.getElementById('hofLink').classList.remove('nodisplay');
    // document.getElementById('howToOpenBtn').classList.remove('nodisplay');

    showRematch(1); //appears just a second as hint of where the restart button is hidden
    setTimeout(function() {
        scroll_hint.className = "hidden"
        remainingBombsInd.className = "visible"
    }, 1500);

    // Time to play!
    initializeScale();
    grid = new Grid(sizeNumber, bombsNumber);

}

function openmenu() {
    var animduration = 800;
    menu_hole.animate({
        r: menu_hex_points[1][0]
    }, animduration, mina.easeout);
}

function showRematch(first) {
    if(first)
      autohideT = 1000;
    else
      autohideT = 2000;
    anim = 200;
    //hiding animation
    remainingBombsInd.className = "hidden";
    //appearing animation and undisplay other element
    setTimeout(function() {
      rematch_button.className = "visible";
      remainingBombsInd.className = "nodisplay";
    }, anim);

    //after some time the remainingBombsInd reappears (useful for touch)
    setTimeout(function() {
        rematch_button.className = "hidden";
    }, autohideT);
    setTimeout(function() {
        rematch_button.className = "nodisplay";
        remainingBombsInd.className = "visible";
    }, autohideT + anim);
}

function refreshNewGame() {
    window.location = window.location.href.split('?')[0] + "?n=" + sizeNumber + "&b=" + bombsNumber;
}

// UI associations

menu_group.node.onclick = function() {
    if (dragging == true)
        return;
    closemenu()
};

// Disable rightclick event (except for toggleFlag)
document.oncontextmenu = function () { return false };

// Compatibility with Firefox for MouseWheel (FF doesn't recognize mousewheel as of FF3.x)
var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"

// the events to be linked to the mouse wheel
var wheelBomb = function(e) { wheelSelect(e, 'bomb') },
    wheelSize = function(e) { wheelSelect(e, 'size') };

if (document.attachEvent) {
    //if IE (and Opera depending on user setting)
    menu_bomb.node.attachEvent("on"+mousewheelevt,wheelBomb);
    m_bomb_icon.node.attachEvent("on"+mousewheelevt,wheelBomb);
    m_bomb.node.attachEvent("on"+mousewheelevt,wheelBomb);
    menu_size.node.attachEvent("on"+mousewheelevt,wheelSize);
    m_size_icon.node.attachEvent("on"+mousewheelevt,wheelSize);
    m_size.node.attachEvent("on"+mousewheelevt,wheelSize);
} else if (document.addEventListener) {
    //WC3 browsers
    menu_bomb.node.addEventListener(mousewheelevt, wheelBomb);
    m_bomb_icon.node.addEventListener(mousewheelevt, wheelBomb, false);
    m_bomb.node.addEventListener(mousewheelevt, wheelBomb, false);
    menu_size.node.addEventListener(mousewheelevt, wheelSize, false);
    m_size_icon.node.addEventListener(mousewheelevt, wheelSize, false);
    m_size.node.addEventListener(mousewheelevt, wheelSize, false);
}

// Ora proviamo con il drag
var dragChangeSpeed = 4;
var stopDragDelay = 100;

//var startDrg = function () { dragging = true }
var stopDrg = function () { setTimeout(function () { dragging = false }, stopDragDelay) }

menu_bomb.node.setAttribute("draggable","true");
menu_bomb.drag(dragSelect('bomb'), function () {}, function () { stopDrg(); B = bombsNumber });

m_bomb_icon.node.setAttribute("draggable","true");
m_bomb_icon.drag(dragSelect('bomb'), function () {}, function () { stopDrg(); B = bombsNumber });

m_bomb.node.setAttribute("draggable","true");
m_bomb.drag(dragSelect('bomb'), function () {}, function () { stopDrg(); B = bombsNumber });

menu_size.node.setAttribute("draggable","true");
menu_size.drag(dragSelect('size'), function () {}, function () { N = sizeNumber; stopDrg() });

m_size_icon.node.setAttribute("draggable","true");
m_size_icon.drag(dragSelect('size'), function () {}, function () { N = sizeNumber; stopDrg() });

m_size.node.setAttribute("draggable","true");
m_size.drag(dragSelect('size'), function () { dragging = true }, function () { N = sizeNumber; stopDrg() });

openmenu();