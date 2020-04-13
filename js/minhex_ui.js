// buttons = document.querySelectorAll(".modal.button")
buttons = document.querySelectorAll(".modal.btn")
// console.log(buttons)
buttons.forEach(element => {
    element.addEventListener("click", function () {
        href = element.getAttribute('href')
        document.querySelector('#howtos').classList.remove('hidden')
        document.querySelectorAll('.modal.panel').forEach(element => {
            element.classList.remove('active')
            element.classList.add('hidden')
        })
        if (href != "#close") {
            document.querySelector(href).classList.toggle('active')
            document.querySelector(href).classList.toggle('hidden')
        } else {
            // lets the animation run
            setTimeout(function () {
                document.querySelector('#howtos').classList.add('hidden')
            }, 700)
        }
        console.log(href)
    })
})


// SWAL da sistemare per il futuro.. magari usando le swal2 nuove?
// o magari le prende dal css con una certa classe di default
//SWEET-ALERT2 default
swal.setDefaults({
    // background: '#5A3120 url(css/img/tile.png)',
    // background: 'inherit',
    background: '',
    // confirmButtonColor: '#f8b71b',
    confirmButtonColor: '',
    // confirmButtonColor: 'inherit',
    showCloseButton: true,
    showConfirmButton: false
})


// WINDOW RESIZE (USING ASPECT RATIO TO CHOOSE THE TWO POSITIONS FOR LABELS SCORE/BOMBS)
function posLabelMenu() {
    if (window.innerWidth / window.innerHeight > 1 || this.window.innerHeight < 600)
        document.querySelector('body').classList.add('bottomLabels')
    else
        document.querySelector('body').classList.remove('bottomLabels')
}

// updates the position of the labelMenu (points/bombs) for better visibility
window.addEventListener("resize", posLabelMenu)
window.addEventListener("load", posLabelMenu)


// COLOR THEMING
function changeBaseColor (e) { 
    refreshNewGame([e.srcElement.getAttribute('data-base-color'), e.srcElement.getAttribute('data-bomb-color')])
    // $('#color_popup').append(col_itm)
}


// var colors = [['#3f51b5','#0400d0'], ['#3c70ab','#0400d0'], ['#5c92d0','#0400d0'], ['#009688','#0400d0'], ['#4caf50','#0400d0'], ['#8bc34a','#0400d0'], ['#cddc39','#0400d0']]
var colors = [
    ['#7358d0', '#da1b87'],
    ['#3c70ab', '#d41c1c'],
    ['#5c92d0', '#d31740'],
    ['#009688', '#e31c58'],
    ['#4caf50', '#e11d3d'],
    ['#8bc34a', '#e1471d']
]

// CREATES THE COLOR LIST IN HTML
colors.forEach(element => {
    col_itm = document.createElement("LI")
    col_bomb_itm = document.createElement("SPAN")
    col_itm.onclick = changeBaseColor
    col_itm.setAttribute('data-base-color', element[0].split('#')[1])
    col_itm.setAttribute('data-bomb-color', element[1].split('#')[1])
    col_itm.setAttribute('style', 'background-color:' + element[0] + ';')
    col_bomb_itm.setAttribute('style', 'background-color:' + element[1]+';')
    col_itm.append(col_bomb_itm)

    document.querySelector('#color_popup').append(col_itm)
})

// change elements (bomb label and theme selector)
document.querySelector('#theme_sel_toggle').setAttribute('style', 'background-color:' + base_clr)
document.querySelector('.label.bombs').setAttribute('style', 'background-color:' + bomb_clr)

// BINDING CLICK FOR OPENING/CLOSING
document.querySelector('#theme_sel_toggle').addEventListener('click', function(){
    document.querySelector('#color_popup').classList.toggle('hidden')
})