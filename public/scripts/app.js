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

function inputError(color) {
    document.querySelector('#tel').style.borderColor = color;
}

function isValid() {
    const numberPattern = '[0][0-9]{9}';
    const telInput = document.querySelector('#tel');
    let number = telInput.value
    if (number.match(numberPattern) != null && number.length === 10) {
        telInput.style.borderColor = "#4ECB71";
        document.querySelector('.submit-btn').removeAttribute('disabled');
    } else {
        telInput.style.borderColor = "black";
        document.querySelector('.submit-btn').setAttribute('disabled', '');
    }
}

isValid(); // call just-in-case the input was already filled