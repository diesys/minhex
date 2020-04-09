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