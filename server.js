//COPYRIGHT SIPHESIHLE BOMELA | ALL RIGHTS RESERVED
// await fetch("url here", {
//     "credentials": "omit",
//     "headers": {
//         "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0",
//         "Accept": "application/json, text/plain, */*",
//         "Accept-Language": "en-US,en;q=0.5",
//         "Content-Type": "application/json",
//         "Save-Data": "on",
//     },
//     "referrer": "http://app.sonke.co.za/",
//     "body": "more stuff here",
//     "method": "POST",
//     "mode": "cors"
// });

// ! STRUCTURE OF SMS
// {"content":"BetVouch: Betway FREE Credit Reminder: Register at https://www.betway.co.za/?btag=P73370-PR22258-CM55263-TS1923988/&SignUpCode=d4u2551 to receive your R30 Betway gaming Voucher. For queries contact sonke@tlcrewards.com Ts&Cs apply.","to":"27736076544"}
 
const express = require('express');
const app = express();
const axios = require('axios');
const port = process.env.PORT || 3000 

require('dotenv').config();

app.set('view engine', 'ejs');

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(express.static('public')); 

app.get('/', (req, res) => { res.render('index') });

app.post('/send', (req, res) => {
  
    tel = req.body.tel;
  
    // validate tel number
    const telRegex = '^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$'

    if (tel.match(telRegex) && tel.length === 10) {
        try {
            // issuing betway affiliate link
            makePostRequest(process.env.BETWAY_API_URL, {
                "CellNumber": tel,
                "SonkeUserID": process.env.SONKEID
            })
            .then(data => { 
                const AffiliateLink = data.AffiliateLink;
                const message = `BetVouch: Betway FREE Credit: Register at ${AffiliateLink} to receive your R30 Betway gaming Voucher. For queries contact sonke@tlcrewards.com Ts&Cs apply.`;
                
                //! send sms to number with affiliate link

                // convert tel to string and and remove zero at beginning and parse to integer
                tel = parseInt('27' + tel.toString().substr(1));// now we have tel in RSA country code format
                
                makePostRequest(process.env.SMS_API_URL, {"content": message, "to" : tel,}).then(data => {
                    return res.json({message: 'Successful, check SMS on your phone with the sign up link', smsSent: data.messages[0].accepted });
                })

            }).catch((err) => {
                console.log('unkown error occured', err);
                throw(new Error(err)) // throw error
            })
        } catch {
            return res.json({message: 'Something went wrong, please check your internet connection or try again later'})
        }
        
    } 
})

app.listen(port, console.log(`listening on localhost:${port}`));

async function makePostRequest(url, payload) {
    let res = await axios.post(url, payload);

    let data = res.data;
    return data
}