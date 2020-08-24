const express = require('express')
const {
    conversation,
    Image,
  } = require('@assistant/conversation')
const bodyParser = require('body-parser')

// Create an app instance
const app = conversation()
 
// Register handlers for Actions SDK
 
app.handle('chargerStatus', conv => {
    console.log('here')
   const client = {
    clientId: 1,
    chargers: [
      {
        id: '2548',
        status: 'CONNECTED'
      }
  ]
  };
  conv.session.params.client = client;
})

const expressApp = express().use(bodyParser.json())

expressApp.post('/fulfillment', app)

module.exports = expressApp
