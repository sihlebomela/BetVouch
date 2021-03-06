const numberForm = document.querySelector('form');
let errorElem = document.querySelector('.input-error');

// Avoid redirecting
numberForm.addEventListener('submit', (ev) => {
    ev.preventDefault();

    // process input
    process();

    // send a post request
    try {
        sendRequest(numberForm, '/send')
        .then(res => {
            console.log(res);
            console.log(res.status)
            const messageElem = document.querySelector('.message');

            // show different visuals depending on response
            if (res.status === 200) {
                // successful, display message
                numberForm.classList.add('success');
                messageElem.innerHTML = res.message;

            } else if (res.status === 449) {
                // number is invalid
                backToDefault();
                errorElem.innerText = res.message;
                inputError('#ED254E');
                isValid();
            } else {
                // an error occured, display error
                numberForm.classList.add('failed');
                messageElem.innerText = res.message;
            }
        })
    } catch {
        //error occured
        backToDefault();
        numberForm.classList.add('failed');
        errorElem = 'Oops! something is wrong on our side, please try again later';
    }
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
    const numberPattern = '[0][6-8][0-9]{8}';
    const telInput = document.querySelector('#tel');
    const submitBtn = document.querySelector('.submit-btn');

    let number = telInput.value;

    if (number.match(numberPattern) != null && number.length === 10) {
        telInput.style.borderColor = "#4ECB71";
        submitBtn.removeAttribute('disabled');
    } else if (number.length === 10) {
        telInput.style.borderColor = "#ED254E";
        submitBtn.setAttribute('disabled', '');
    } else {
        submitBtn.setAttribute('disabled', '');
        telInput.style.borderColor = "black";
    }
}

function process() {
    numberForm.classList.add('process');
    const telInput = document.querySelector('#tel');
    telInput.setAttribute('readonly', ''); // disable input
}

function backToDefault() {
    numberForm.classList.remove('process');
    const telInput = document.querySelector('#tel');
    telInput.removeAttribute('readonly', ''); // enable input
}

isValid(); // call just-in-case the input was already filled