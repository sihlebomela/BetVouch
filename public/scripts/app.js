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