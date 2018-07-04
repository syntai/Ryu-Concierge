'use strict';
const Alexa = require('alexa-sdk');
const BalanceHandlers = require('./portfolio/handlers');

const HELP_MESSAGE = `You can say: 
    what is my bitcoin balance,
    add ten bitcoin to my portfolio,
    remove one bitcoin,
    how much money do I have,
    what is the price of bitcoin,
    what is in my portfolio, or,
    you can say exit... What can I help you with?`;
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';
const FALLBACK_MESSAGE = "The Ryu Concierge skill can't help with that";

const handlers = {
    'LaunchRequest': function () {
        const speechOutput = 'Hi! How can Ryu Concierge help you today?';

        this.response.speak(speechOutput).listen(HELP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        this.response.speak(HELP_MESSAGE).listen(HELP_REPROMPT);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.FallbackIntent': function () {
        this.response.speak(FALLBACK_MESSAGE);
        this.emit(':responseReady');
    },
    'Unhandled': function () {
        const speechOutput = 'Sorry, I’m not sure about that.';

        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.dynamoDBTableName = 'ryu';
    alexa.registerHandlers(BalanceHandlers);
    alexa.registerHandlers(handlers);
    alexa.execute();
};
