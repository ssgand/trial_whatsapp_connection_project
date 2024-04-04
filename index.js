const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios').default;

require('dotenv').config();

const app = express();

const port = process.env.PORT;

// const token = process.env.WHATSAPP_TOKEN

const verify_token = process.env.VERIFY_TOKEN;

app.use(bodyParser.json())

app.listen(port, () => console.log('app is listening'))

app.get('/', (req, res) => {
    return res.status(200).json({
        message: 'working'
    })
})

app.post('/webhook', async (req, res) => { 
    
    // let from = req.body.entry[0].changes[0].value.messages[0].from;

    console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

    const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
    
    if (message?.type === 'text') {
        const phone_number_id = req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;
    
    
        try {
            axios({
                method: 'POST',
                url: 'https://graph.facebook.com/v18.0/' + phone_number_id + '/messages',
                data: {
                    messaging_product: 'whatsapp',
                    to: message.from,
                    text: {body: 'Test: ' + message.text.body}
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
    }
});

app.get("/webhook", (req, res) => {
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
  
    if (mode && token) {
      if (mode === "subscribe" && token === verify_token) {
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    }
});