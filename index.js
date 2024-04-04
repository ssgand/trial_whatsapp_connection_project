const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios').default;

require('dotenv').config();

const app = express();
const port = process.env.PORT;

const token = 'EAAGT5T53Y4gBOZBVwWciG5mfZAwgQKCZCDKMGuvD48RhP1UY2dAzi0dwaZCJsl9iQxBAMc5N2ynQo8FK1KHmGu2WUSqDw3iz8Xn6OzXTs4JETKDkTH39G2HQU2ordOxJmRJbWIqz3ZAQiwTgWxlKX0sN1VZCXKLy5noEsm4LS0vFTMIsNqaCnFb0vbi8qbGxkxWSo8YkdAqM239n2jN9EZD';

app.use(bodyParser.json())

app.listen(port, () => console.log('app is listening'))

app.get('/', (req, res) => {
    return res.status(200).json({
        message: 'working'
    })
})

app.post('/send-whatsapp', async (req, res) => { 
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