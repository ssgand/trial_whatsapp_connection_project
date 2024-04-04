const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios').default;

require('dotenv').config();

const app = express();
const port = process.env.PORT;

const token = 'EAAGT5T53Y4gBOy72rReJ1q9RksbIoiisuGe4ZAIOZCbqBv4sUQEl7DtWAmGRIVjz62COuWYLjPD4gHRansrHkbA3ngcRKe3PY9vmDKU4yJ7ZCCarUtRteMewJAjMwpkxFbeJifJl4EZBoab1QpEqzWbhEfL68WXPcEF4nhNRhAwFwCtxSUM7quoPZC8IvkHuZAKFflej8I39DlIg2hT9gZD';

app.use(bodyParser.json())

app.listen(port, () => console.log('app is listening'))

app.get('/', (req, res) => {
    return res.status(200).json({
        message: 'working'
    })
})

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