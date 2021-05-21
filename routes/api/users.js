const express = require("express");
const router = express.Router();
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = './config/token.json';
var oAuth2Client = {};
fs.readFile('./config/credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Gmail API.
    const { client_secret, client_id, redirect_uris } = JSON.parse(content).installed;
    oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return 0;
        oAuth2Client.setCredentials(JSON.parse(token));

    });

});

// Load client secrets from a local file.
router.post("/geturl", (req, res) => {

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) {
            const authUrl = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES,
            });
            console.log('Authorize this app by visiting this url:', authUrl);
            return res.status(200).json({ authUrl: authUrl });

        }
        else {
            oAuth2Client.setCredentials(JSON.parse(token));
            return res.status(400).json({ error: "token already exsists" });

        }
    });


})

router.post("/sendToken", (req, res) => {
    const code = req.body.token;
    oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) return res.status(400).json({ error: err });
            return res.status(200).json({ Message: "Success" });
        });
    }
    )

})


// api to send email and create email  
router.post("/sendEmail", (req, res) => {
    const to = req.body.to; 
    const from = req.body.from;
    const subject = req.body.subject;
    const message = req.body.message;
    var str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ", to, "\n",
        "from: ", from, "\n",
        "subject: ", subject, "\n\n",
        message
    ].join(''); // str contains the email
    var encodedMail = new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_'); 
    const gmail = google.gmail({ version: 'v1', oAuth2Client });
    gmail.users.messages.send({             // Try to send mail
        auth: oAuth2Client,
        userId: 'me',
        resource: {
            raw: encodedMail
        }

    }, function (err, response) {
        if(err){
            return res.status(400).json({ error: err }); // return error

        } 
        if (response){
            return res.status(200).json({ Message: "Success" });    // return Success
        }
        
    });


})

module.exports = router;