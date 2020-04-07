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

//SWEET-ALERT2 default
swal.setDefaults({
    background: '#5A3120 url(css/img/tile.png)',
    confirmButtonColor: '#f8b71b',
    showCloseButton: true,
    showConfirmButton: false
})