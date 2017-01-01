var menu = Snap('#menu');

// CONF
var menu_hex_points = [ [320,0], [640,0], [800,280], [640,550], [320,550], [160,280]],
    menu_center = [ ( menu_hex_points[1][0] - menu_hex_points[0][0] / 2 ), menu_hex_points[2][1] ],

    //colors
    menu_play_clr = "#a9d41c",
    menu_hex_clr  = menu_play_clr,
    menu_bomb_clr = "#E61913",
    menu_size_clr = "#F5B10A",
    menu_fame_clr = "#8BAF17",

    menu_hex = menu.polygon(menu_hex_points).attr({fill: menu_hex_clr }),
    menu_hex_holemask = menu.polygon(menu_hex_points).attr({fill: "#fff" }),
    menu_play = menu.polygon(menu_hex_points[0], menu_hex_points[1], menu_hex_points[4], menu_hex_points[5]).attr({fill: menu_play_clr }),
    menu_bomb = menu.polygon(menu_center, menu_hex_points[3], menu_hex_points[4]).attr({ fill: menu_bomb_clr }),
    menu_size = menu.polygon(menu_center, menu_hex_points[2], menu_hex_points[3]).attr({ fill: menu_size_clr });
    // menu_hex_shadow = menu.polygon(menu_hex_points).attr({fill: "#000", opacity: ".5" }),
    // menushadow = menu.filter(Snap.filter.blur(10));
    // menu_hex_shadow.attr({ filter: menushadow });
    // menu_fame = menu.polygon(menu_center, menu_hex_points[1], menu_hex_points[2]).attr({ fill: menu_fame_clr });
    var menushadow2 = menu.filter(Snap.filter.shadow(0, 10, 10, "#000", .6));
    menu_hex.attr({filter: menushadow2});

var m_text_opt = {'text-anchor':'middle', 'alignment-baseline': 'central'};
  m_text_opt['font-size'] = 3.5 + 'em';
  m_text_opt['font-family'] = 'OpenSansBold';
  m_text_opt['font-weight'] = 600;
  m_text_opt['fill'] = "#fff";

var m_img_halfsize = 60,
    m_bomb = menu.text(menu_center[0], 1.75 * menu_center[1], "30").attr(m_text_opt),
    m_bomb_icon = menu.image('img/menu/bomb.png', menu_center[0] - m_img_halfsize, 1.25 * menu_center[1]),
    m_size  = menu.text(menu_hex_points[3][0], 1.65 * menu_center[1], "7").attr(m_text_opt),
    m_size_icon = menu.image('img/menu/size.png', menu_hex_points[3][0] - m_img_halfsize, 1.1 * menu_center[1]),
    m_play = menu.text(menu_center[0] - 1.6 * m_img_halfsize, menu_center[1], "PLAY").attr(m_text_opt),
    m_play_icon = menu.image('img/menu/play.png', menu_hex_points[5][0] + m_img_halfsize/2, menu_center[1] - m_img_halfsize);
    m_play.attr({fill: "#1f1f1f"});

//elements

var menu_play_btn = menu.group(menu_play, m_play, m_play_icon),
    menu_size_opt = menu.group(menu_size, m_size, m_size_icon),
    menu_bomb_opt = menu.group(menu_bomb, m_bomb, m_bomb_icon),
    // menu_fame_opt = menu.group(menu_fame, /*m_fame,*/ m_fame_icon),

    menu_hole_shadow = menu.circle(menu_center[0], menu_center[1] + 2, menu_hex_points[1][0] - menu_hex_points[0][0] + 25).attr({fill: "#000", opacity: "0", mask: menu_hex_holemask }),
    menu_hole = menu.circle(menu_center[0], menu_center[1], menu_hex_points[1][0] - menu_hex_points[0][0] + 15).attr({fill: "#fff"}),
    menu_group = menu.group(menu_hex, menu_play, m_play, m_play_icon, menu_bomb, m_bomb, m_bomb_icon, menu_size, m_size, m_size_icon).attr({mask: menu_hole});

function closemenu() {
  var animduration = 1000;
  menu_hole_shadow.attr({opacity: ".3"});
  menu_hole.animate({r: 0}, animduration, mina.bounce);
  menu_hole_shadow.animate({r: 0, opacity: ".1"}, animduration, mina.bounce);
  var shadowblur = menu.filter(Snap.filter.blur(2));
  menu_hole_shadow.attr({ filter: shadowblur });

  // menu_group.animate({opacity: "0"}, 1000, mina.ease);
  // menu.attr({display: "none"});
}
