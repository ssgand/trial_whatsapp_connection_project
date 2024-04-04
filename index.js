const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios').default;

require('dotenv').config();

const app = express();
const port = process.env.PORT;

const token = process.env.TOKEN;

const verify_token = process.env.VERIFY_TOKEN;

app.use(bodyParser.json())

app.listen(port, () => console.log('app is listening'))

app.get('/', (req, res) => {
    return res.status(200).json({
        message: 'working'
    })
})

app.get("/webhook", (req, res) => {
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
  
    if (mode && token) {
      if (mode == "subscribe" && token == verify_token) {
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        console.log((token));
        console.log(port);
        console.log(verify_token);
        res.sendStatus(403);
      }
    }
});

app.post('/webhook', async (req, res) => { 
    let phone_number_id = req.body.entry[0].changes[0].value.metadata.phone_number_id;
    let from = req.body.entry[0].changes[0].value.messages[0].from;
    let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;
    // let from = '+250782767382';
    // let msg_body = 'Hello wiredin World!'
    
    try {
        axios({
            method: 'POST',
            url: 'https://graph.facebook.com/v18.0/' + phone_number_id + '/messages?access_token=' + token,
            data: {
                messaging_product: 'whatsapp',
                to: from,
                text: {body: 'wcA: ' + msg_body}
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })

        
        res.json({ success: true });
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        res.status(500).json({ error: 'Failed to send WhatsApp message' });
    }
});