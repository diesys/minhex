// Get arguments

argv = {}
window.location.search.substring(1).split('&').forEach(function(c) {
    var kv = c.split('=');
    argv[kv[0]] = kv[1]
});


// General settings  //////////////////////

//SWEET-ALERT2 default
swal.setDefaults({
    background: '#5A3120 url(img/tile.png)',
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
    // base_clr = "#A9D41C",
    base_clr = "#76B918",
    // field_bg_color = "#59710E",
    field_bg_color = "#190900",
    field_bg_opacity = "1",
    stroke_clr = "rgba(0,0,0,.1)",
    stroke_width = "2",
    // clicked_clr = "#698511",
    clicked_clr = "#507521",
    // over_clr = "#e8ff7d",
    over_clr = "#B4E575",
    bomb_clr = "#C10F08",
    bomb2_clr = "#950601",
    flag_clr = "#f8b71b",
    anim_dur = 130;

var textDimension = 2.1,
    fontColor = "#fff",
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
    this.cell = {};
    this.clickedCells = 0;
    this.remBmbs = BOMBS;

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
                // single click
                doubleClick.waitingSndClick = false;
                this.grid.openCell(pos);
            };
            doubleClick.lastClick = setTimeout(f, doubleClick.mouseClickDelay);
        }
    }

    this.refreshBombs = function(delta) {
        this.remBmbs += delta;
        //just a temp fix to a bug that can show negative bombs remaining if you put too flags
        if (this.remBmbs >= 0)
            remainingBombsInd.innerHTML = this.remBmbs;
    }

    this.openCell = function(pos) {
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
                cell.animate({
                    fill: bomb_clr,
                }, anim_dur, mina.easein);
                this.FINISHED = true;
                cell.state = "clicked";
                // setTimeout(function() {
                //     // rematch
                //     var answer = confirm("Pieces of your fleshy brain are all over the walls. Pay more attention to mines next time. Rematch?")
                //     if (answer)
                //     // the url just without vars, and the just used ones
                //         window.location = window.location.href.split('?')[0] + "?n=" + sizeNumber + "&b=" + bombsNumber; // + "&rematch=true"; //seems do not work the rematch url
                //     else
                //         window.location = window.location.href.split('?')[0] + "?n=" + sizeNumber + "&b=" + bombsNumber;
                // }, 700);
                swal({
                  title: 'Damn!',
                  text: 'Pieces of your fleshy brain are all over the walls. Pay more attention to mines next time!',
                })

                for (c of Object.keys(this.cell))
                    if (this.cell[c].isBomb && c != pos) {
                        this.cell[c].animate({
                            fill: bomb2_clr
                        }, anim_dur, mina.easein);
                        this.cell[c].state = "clicked";
                    }

                return
            }
            cell.animate({
                fill: clicked_clr,
            }, anim_dur, mina.easein);
            if (cell.count)
                textOnCell(cell.pos, cell.count.toString()).click(this.mouseClick(pos));
            else
                for (c of cell.nbHood)
                    this.openCell(c);

        } else // convert to switch?
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

    this.checkVictoryOldAlert = function() {
        if (this.clickedCells == 6 * N * N)
            setTimeout(function() {
                // Ok to retry with same parameters or cancel to have the menu back again
                var answ = confirm("You are a real mine survivor! Good Job. Retry?")
                if (answ)
                // the url just without vars, and the just used ones
                    window.location = window.location.href.split('?')[0] + "?n=" + sizeNumber + "&b=" + bombsNumber; // + "&rematch=true"; //seems do not work the rematch url

                // this should open the menu and cancel variabiles instead of reloading the page?
                else
                    window.location = window.location.href.split('?')[0] + "?n=" + sizeNumber + "&b=" + bombsNumber;
            }, 700);
    }

    this.checkVictory = function() {
        if (this.clickedCells == 6 * N * N)
            swal({
              title: 'Awesome!',
              text: 'You are a real mine survive, good job!',
            })
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
                this.refreshBombs(-1);
                break;
            case "flag":
                cell.state = "virgin";
                cell.animate({
                    fill: base_clr
                }, anim_dur, mina.easeout);
                this.clickedCells--;
                this.refreshBombs(1);
        }
        this.checkVictory();
    }

    this.addCell = function(i, j) {
        var c = drawCell(i, j);
        c.isBomb = false;
        c.state = "virgin" // virgin, flag, clicked
        c.click(this.mouseClick([i, j]));
        c.grid = this;
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

// hide the menu if it's a rematch
// if (argv["rematch"] == "true") {
//   menu.attr({
//     display: "none"
//   });
// }


// UI CONF
document.getElementById('menu').setAttribute('width', fieldWidth);
document.getElementById('menu').setAttribute('height', fieldHeight);
// var menu_hex_points = new Array()
// menu_hex_points.push([x0,y0])
// menu_hex_points.push([x0 + N*l, y0])
// menu_hex_points.push([x0 + N*1.5*l, y0 + N*l*hsr3])
// menu_hex_points.push([x0 + N*l, y0 + N*l*hsr3*2])
// menu_hex_points.push([x0, y0 + N*l*hsr3*2])
// menu_hex_points.push([x0-N*l/2, y0 + N*l*hsr3])


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
    menu_bomb_clr = "#E61913",
    menu_size_clr = "#F5B10A",
    // menu_fame_clr = "#8BAF17",
    menu_fame_clr = "clicked_clr",



    // filters
    // menushadow = menu.filter(Snap.filter.shadow(0, 10, 15, "#000", .4)),
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

// if (argv["rematch"] == "true") {
//   field_bg.attr({
//     display: "none"
//   });
// }

var m_text_opt = {
    'text-anchor': 'middle',
    'alignment-baseline': 'central'
};
m_text_opt['font-size'] = parseInt(L * .1) + 'pt';
m_text_opt['font-family'] = 'OpenSansBold';
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
    // m_bomb_icon = menu.image('img/menu/bomb.png', menu_center[0] - m_img_halfsize, 1.25 * menu_center[1]),
    m_size = menu.text(menu_hex_points[3][0], 1.6 * menu_center[1], N).attr(m_text_opt),
    m_size_icon = menu.image('img/menu/size.png', menu_hex_points[3][0] - L * sizeBox * .5, 1.1 * menu_center[1], L * sizeBox, L * sizeBox),
    // m_size_icon = menu.image('img/menu/size.png', menu_hex_points[3][0] - m_img_halfsize, 1.1 * menu_center[1]),
    m_play = menu.text(menu_center[0] - .95 * L * playBox, menu_center[1], "PLAY").attr(m_text_opt),
    m_play_icon = menu.image('img/menu/play.png', menu_hex_points[5][0] + L * playBox * .25, menu_center[1] - L * playBox * .5, L * playBox, L * playBox);

// m_play_icon = menu.image('img/menu/play.png', menu_hex_points[5][0] + m_img_halfsize/2, menu_center[1] - m_img_halfsize);
m_play.attr({
    fill: "#1f1f1f"
});


//elements

var scroll_hint = document.getElementById("scroll_hint"),
    rematch_button = document.getElementById("rematch"),
    remainingBombsInd = document.getElementById("RemainingBombs");

var menu_play_btn = menu.group(menu_play, m_play, m_play_icon),
    menu_size_opt = menu.group(menu_size, m_size, m_size_icon),
    menu_bomb_opt = menu.group(menu_bomb, m_bomb, m_bomb_icon),
    // menu_fame_opt = menu.group(menu_fame, /*m_fame,*/ m_fame_icon),

    menu_hole = menu.circle(menu_center[0], menu_center[1], menu_hex_points[1][0] / 8).attr({
        fill: "#fff"
    }),

    menu_hole_shadow = menu.circle(menu_center[0], menu_center[1] + 2, menu_hex_points[1][0] + 45).attr({
        fill: "#000",
        opacity: "0",
        mask: menu_hex_holemask
    }),

    menu_group = menu.group(menu_hex, menu_play, m_play, m_play_icon, menu_bomb, m_bomb, m_bomb_icon, menu_size, m_size, m_size_icon).attr({
        mask: menu_hole
    });
// functions

//// MouseWheel

var bombsNumberFloat = B * 1.,
    sizeNumberFloat = N * 1.,
    maxbombs = 3 * sizeNumber * (sizeNumber + 1), //number of cells
    maxsize = 14; //just too cells for screens, quite unsable


function wheelSelect(e, opt) {
    var speedWheel = .01;
    // credo si possa snellire molto questa, meglio usare l'oggetto chiamante se riusciamo, piuttosto che determinarlo dentro la funzione
    if (opt == 'bomb') {
/*        if (e.deltaY > 0)
            bombsNumberFloat -= .1;
        else
            bombsNumberFloat += .1;
*/
        bombsNumberFloat -= e.deltaY * speedWheel;
        bN = parseInt(bombsNumberFloat); // i think this if is equivalent to bombsNumberFloat += e.deltaY * .1;
        if (bN > 0) {
            bombsNumber = bN;
            m_bomb.node.innerHTML = bombsNumber;
        }
    } else if (opt == 'size') {
        /*if (e.deltaY > 0)
            sizeNumberFloat -= .1;
        else
            sizeNumberFloat += .1;
        */
        sizeNumberFloat -= e.deltaY * speedWheel;
        sN = parseInt(sizeNumberFloat);
        if (sN > 1 && sN <= maxsize) {
            sizeNumber = sN;
            m_size.node.innerHTML = sizeNumber;
            maxbombs = 3 * sizeNumber * (sizeNumber + 1)
        }
    }
}

//// Menu

// inhibit click when dragging
var dragging = false,
    dragTolerance = 5;

function dragSelect (obj) {
    var speedDrag = .1;
    return function (dx, dy) {
        if (Math.abs(dy)+Math.abs(dx) < dragTolerance)
            return;
        dragging = true;

        if (obj == "bomb") {
            bombsNumberFloat = B - dy * speedDrag;
            bN = parseInt(bombsNumberFloat);
            if (bN > 0) {
                bombsNumber = bN;
                m_bomb.node.innerHTML = bombsNumber;
            }
        } else if (obj == "size") {
            sizeNumberFloat = N - dy * speedDrag;
            sN = parseInt(sizeNumberFloat);
            if (sN > 1 && sN <= maxsize) {
                sizeNumber = sN;
                m_size.node.innerHTML = sizeNumber;
                maxbombs = 3 * sizeNumber * (sizeNumber + 1)
            }
        }
    }
}

function closemenu() {
    if (bombsNumber < maxbombs) {
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

        showRematch(1); //appears just a second as hint of where the restart button is hidden
        setTimeout(function() {
            scroll_hint.className = "hidden"
            remainingBombsInd.className = "visible"
        }, 1500);

        // Time to play!
        initializeScale();
        grid = new Grid(sizeNumber, bombsNumber);
    } else {
        swal({
          title: 'How brave you!',
          text: 'You chose too many bombs, more that you can afford, retry with less!',
          timer: 2000,
        }).then(
          function () {},
            // handling the promise rejection
            function (dismiss) {
              if (dismiss === 'timer') {
                console.log('sweetalert closed by the timer, retry with less bombs')
              }
            }
        )
      }
}

function openmenu() {
    var animduration = 400;
    setTimeout(function() {
        // menu_group.animate({
        //     transform: "r" + 360, centerX, centerY
        //   }, animduration, mina.ease);
        menu_hole.animate({
            r: menu_hex_points[1][0]
        }, animduration, mina.easeout);
    }, 200);

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

// HowTo

function HowTo(option) {
    ht1 = document.getElementById("HT1");
    ht2 = document.getElementById("HT2");
    ht3 = document.getElementById("HT3");
    // var animduration = 800;

    if (option == '1') {
        ht1.className = "HowTo active";
    } else if (option == '2') {
        ht1.className = "HowTo hidden";
        ht2.className = "HowTo active";
    } else if (option == '3') {
        ht2.className = "HowTo hidden";
        ht3.className = "HowTo active";
    } else {
        ht1.className = "HowTo inactive";
        ht2.className = "HowTo inactive";
        ht3.className = "HowTo inactive";
        //intermediate class to get a disappearing animation
        setTimeout(function() {
          ht1.className = "HowTo hidden";
          ht2.className = "HowTo hidden";
          ht3.className = "HowTo hidden";
        }, 900); ///// !!!! DONT CHANGE UNTIL YOU CHANGE THE CSS ANIMATION FADEOUT DURARION !!!
    }
}

// function fadeOut(element, milliseconds) {
//   var interv = milliseconds / 20;
//   for(i=0; i < 2000; i++) {
//     setTimeout(function() {
//       element.attr({
//         opacity: i/20
//       })
//     }, interv)
//   }
//
// }

// UI associations

menu_group.node.onclick = function() {
    if (dragging == true)
        return;
    closemenu()
};

menu_bomb.node.onmousewheel = function(e) {
    wheelSelect(e, 'bomb')
};
m_bomb_icon.node.onmousewheel = function(e) {
    wheelSelect(e, 'bomb')
};
m_bomb.node.onmousewheel = function(e) {
    wheelSelect(e, 'bomb')
};

menu_size.node.onmousewheel = function(e) {
    wheelSelect(e, 'size')
};
m_size_icon.node.onmousewheel = function(e) {
    wheelSelect(e, 'size')
};
m_size.node.onmousewheel = function(e) {
    wheelSelect(e, 'size')
};

// Ora proviamo con il drag

var dragChangeSpeed = 4;
var stopDragDelay = 100;

var startDrg = function () { dragging = true }
var stopDrg = function () { setTimeout(function () { dragging = false }, stopDragDelay) }

menu_bomb.node.setAttribute("draggable","true");
menu_bomb.drag(dragSelect('bomb'), function () {}, function () {event.dataTransfer.setData('text/plain', null); B = bombsNumber; stopDrg() });
/*menu_bomb.node.addEventListener('dragstart', function (e){
                e.dataTransfer.setData('text/plain', 'node');
            }, false);*/

m_bomb_icon.node.setAttribute("draggable","true");
m_bomb_icon.drag(dragSelect('bomb'), function () {}, function () {event.dataTransfer.setData('text/plain', null); B = bombsNumber; stopDrg() });
/*m_bomb_icon.node.addEventListener('dragstart', function (e){
                e.dataTransfer.setData('text/plain', 'node');
            }, false);*/

m_bomb.node.setAttribute("draggable","true");
m_bomb.drag(dragSelect('bomb'), function () {}, function () {event.dataTransfer.setData('text/plain', null); B = bombsNumber; stopDrg() });
/*m_bomb.node.addEventListener('dragstart', function (e){
                e.dataTransfer.setData('text/plain', 'node');
            }, false);*/

menu_size.node.setAttribute("draggable","true");
menu_size.drag(dragSelect('size'), function () {}, function () { N = sizeNumber; stopDrg() });

m_size_icon.node.setAttribute("draggable","true");
m_size_icon.drag(dragSelect('size'), function () {}, function () { N = sizeNumber; stopDrg() });

m_size.node.setAttribute("draggable","true");
m_size.drag(dragSelect('size'), function () { dragging = true }, function () { N = sizeNumber; stopDrg() });


openmenu();
//var grid;
