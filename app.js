const HOST = 'https://k2okr4a4of.execute-api.us-east-1.amazonaws.com/dev';
const express = require('express')
const fetch = require('node-fetch');
const {
    conversation,
    Image,
  } = require('@assistant/conversation')
const bodyParser = require('body-parser')

// Create an app instance
const app = conversation()
 
// Register handlers for Actions SDK

const chargerStatusRequest = () => {
  return fetch(`${HOST}/charger-status`)
      .then(response => response.json())
      .catch(error => {
        const errorObject = {
          systemMessage: error,
          userMessage: `In this moment I'm not available`
        }
        return errorObject;
      });
};

const lockUnlockRequest = (action) => {
  const body = {
      action
  };

  return fetch(`${HOST}/lock-unlock`,
      {
          method: 'put',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
      }
  )
  .then(res => res.json())
  .catch(error => {
        const errorObject = {
          systemMessage: error,
          userMessage: `In this moment I'm not available`
        }
        return errorObject;
      });
};

app.handle('create_user', async conv => {
  console.log(JSON.stringify(conv));
  //conv.add(JSON.stringify(conv));
  conv.scene.next.name = "Main";
});

app.handle('getChargerStatus', async conv => {
  const response = await chargerStatusRequest();
  // Esta parte del codigo es necesaria?
  console.log(JSON.stringify(response));
  if (!response.error) {
    const charger = {
      id: '',
      message: response.message,
      status: response.locked
    };
    conv.session.params.client = '';
    conv.session.params.chargers = [charger];
      //se devuelve al usuario el mensaje que viene del middleware  
    conv.add(response.message);
  } else {
    console.log(response);
    conv.add(response.userMessage);
    conv.scene.next.name = "Main";
  }
});

app.handle('setChargerStatus', async conv => {
  if (conv.intent.params.action_lock && conv.intent.params.action_lock.resolved) {
    const action = conv.intent.params.action_lock.resolved;
  const response = await lockUnlockRequest(action);
  console.log(JSON.stringify(response));
  //Es necesario este codigo?
  if (!response.error) {
    const charger = {
      id: '',
      message: response.message,
      status: response.locked
    };
    conv.session.params.client = '';
    conv.session.params.chargers = [charger];
    console.log(response.message);
    conv.add(response.message);
  } else {
    console.log(response);
    conv.add(response.userMessage);
    conv.scene.next.name = "Main";
  }  
  } else {
    conv.add(`Sorry I didn't catch what you said`);
    conv.scene.next.name = "Main";
  } 
    
});

app.handle('setSchedule', async conv => {  
  console.log(JSON.stringify(conv));
  conv.add('Yeah');
  conv.scene.next.name = "Main";
  /*if (conv.intent.params.action_lock && conv.intent.params.action_lock.resolved) {
    const action = conv.intent.params.action_lock.resolved;
  const response = await lockUnlockRequest(action);
  console.log(JSON.stringify(response));
  //Es necesario este codigo?
  if (!response.error) {
    const charger = {
      id: '',
      message: response.message,
      status: response.locked
    };
    conv.session.params.client = '';
    conv.session.params.chargers = [charger];
    console.log(response.message);
    conv.add(response.message);
  } else {
    console.log(response);
    conv.add(response.userMessage);
    conv.scene.next.name = "Main";
  }  
  } else {
    conv.add(`Sorry I didn't catch what you said`);
    conv.scene.next.name = "Main";
  } */
    
});

const expressApp = express().use(bodyParser.json())

expressApp.post('/fulfillment', app)

module.exports = expressApp
