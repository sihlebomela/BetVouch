// COPYRIGHT SIPHESIHLE BOMELA
const express = require('express');
const app = express();
const axios = require('axios');
const port = process.env.PORT || 3000

app.set('view engine', 'ejs');

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({
    extended: true
}));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index')
});

app.post('/send', (req, res) => {

    tel = req.body.tel;

    // validate tel number
    const telRegex = '^[0][6-8][0-9]{8}$'

    if (tel.match(telRegex) && tel.length === 10) {
        try {
            // issuing betway affiliate link
            makePostRequest(process.env.BETWAY_API_URL, {
                    "CellNumber": tel,
                    "SonkeUserID": process.env.SONKEID
                })
                .then(data => {
                    const AffiliateLink = data.AffiliateLink;
                    const message = `BetVouch: Betway FREE Credit: Register at
                    ${AffiliateLink} 
                    to receive your R30 Betway gaming Voucher. 
                    
                    For queries contact sonke@tlcrewards.com Ts&Cs apply.`;

                    //! send sms to number with affiliate link

                    // convert tel to string and and remove zero at beginning and parse to integer
                    tel = parseInt('27' + tel.toString().substr(1)); // now we have tel in RSA country code format

                    makePostRequest(process.env.SMS_API_URL, {
                        "content": message,
                        "to": tel,
                    }).then(data => {
                        return res.status(200).json({
                            message: 'Perfect, We sent an SMS with the sign up link, Enjoy!<img src="https://cdn-0.emojis.wiki/emoji-pics/apple/grinning-face-with-smiling-eyes-apple.png" width="25px">',
                            smsSent: data.messages[0].accepted,
                            status: 200
                        });
                    })

                }).catch((err) => {
                    console.log('unkown error occured', err);
                    throw (new Error(err)) // throw error
                })
        } catch {
            return res.status(520).json({
                message: 'Something went wrong, please check your internet connection or try again later',
                status: 520
            })
        }

    } else {
        return res.status(449).json({
            message: 'Phone Number is invalid',
            status: 449
        })
    }
})

app.listen(port, console.log(`listening on localhost:${port}`));

async function makePostRequest(url, payload) {
    let res = await axios.post(url, payload);

    let data = res.data;
    return data
}
