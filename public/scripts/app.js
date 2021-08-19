const numberForm = document.querySelector('form');

// Avoid redirecting
numberForm.addEventListener('submit', (ev) => {
    ev.preventDefault();

    // send a post request
    sendRequest(numberForm, '/send')
        .then(res => {
            console.log(res);
        })
})

async function sendRequest(formElem, route) {
    const data = new URLSearchParams(new FormData(formElem));

    let options = {
        method: 'POST',
        header: {
            'Content-Type': 'x-www-form-urlencoded'
        },
        body: data
    }

    let response = await fetch(route, options)
    let json = await response.json();
    return json;
}

//Toggle Theme Feature
let themeButton = document.querySelector('.theme-toggler');

themeButton.addEventListener('click', () => {
    document.body.classList.toggle('light');
})