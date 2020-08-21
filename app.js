const express = require('express')
const {
    conversation,
    Image,
  } = require('@assistant/conversation')
const bodyParser = require('body-parser')

// Create an app instance
const app = conversation()
 
// Register handlers for Actions SDK
 
app.handle('nerius', conv => {
  conv.add('Hi, how is it going?')
  conv.add(new Image({
    url: 'https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg',
    alt: 'A cat',
  }))
})

const expressApp = express().use(bodyParser.json())

expressApp.post('fulfillment', app)

module.exports = expressApp
