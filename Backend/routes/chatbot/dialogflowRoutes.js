const express = require('express');
const chatbotRouter= express.Router();
const dialogflow = require('dialogflow');
const config = require('../../config/dev');
const Complain = require('../../models/users/complain');
require('dotenv').config();


// Create a new session
const sessionClient = new dialogflow.SessionsClient({
    // Access the GOOGLE_APPLICATION_CREDENTIALS path
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});
const sessionPath = sessionClient.sessionPath(process.env.GOOGLE_PROJECT_ID, process.env.DIALOGFLOW_SESSION_ID);


//text query route
chatbotRouter.post('/textQuery', async (req, res) => {
    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
        text: {
            // The query to send to the dialogflow agent
            text: req.body.text,
            // The language used by the client (en-US)
            languageCode: process.env.DIALOGFLOW_LANGUAGE_CODE,
        },
        },
    };
    
    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
        res.send(result);
        console.log(result);
    } else {
        console.log(`No intent matched.`);
        res.send({text: 'I am sorry, I do not understand that.'});
    }
    
   
});




//event query route
chatbotRouter.post('/eventQuery', async (req, res) => {
    
    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
        event: {
            // The query to send to the dialogflow agent
            name: req.body.event,
            // The language used by the client (en-US)
            languageCode: process.env.DIALOGFLOW_LANGUAGE_CODE,
        },
        },
    };
    
    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
        console.log(`  Intent: ${result.intent.displayName}`);
        //console.log(result);
        res.send(result);
    } else {
        console.log(`No intent matched.`);
        res.send({text: 'I am sorry, I do not understand that.'});
    }
    
   
});

module.exports = chatbotRouter;