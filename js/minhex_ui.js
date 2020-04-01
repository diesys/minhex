buttons = document.querySelectorAll(".modal.button")
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