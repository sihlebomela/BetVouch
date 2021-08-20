const numberForm = document.querySelector('form');

// Avoid redirecting
numberForm.addEventListener('submit', (ev) => {
    ev.preventDefault();

    // process input
    process();

    // send a post request
    sendRequest(numberForm, '/send')
        .then(res => {
            console.log(res);
            console.log(res.status)

            // show different visuals depending on response
            if(res.status === 200) {
                // successful, display message
                numberForm.classList.add('success');             
                const messageElem = document.querySelector('.message');
                messageElem.innerText = res.message;

            } else if (res.status === 449) {
                // number is invalid
                backToDefault();
                inputError('#ED254E');
            } else {
                // an error occured, display error
            }
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