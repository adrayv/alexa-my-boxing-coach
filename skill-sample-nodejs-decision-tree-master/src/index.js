/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

var Alexa = require('alexa-sdk');

var states = {
    STARTMODE: '_STARTMODE',                // Prompt the user to start or restart the game.
    ASKMODE: '_ASKMODE',                    // Alexa is asking user the questions.
    //DESCRIPTIONMODE: '_DESCRIPTIONMODE'     // Alexa is describing the final choice and prompting to start again or quit
};


// Punch Combinations
var nodes = [
	"jab cross",
	"jab jab cross",
	"jab cross hook",
	"jab cross hook cross",
	"jab cross uppercut cross",
	"jab uppercut hook cross",
	"cross hook cross",
	"hook cross hook"
];

// These are messages that Alexa says to the user during conversation

// This is the intial welcome message
var welcomeMessage = "Hello, I am your boxing coach. After each punch combination, say yes to continue, or say no to stop. Are you ready to begin?";

// This is the message that is repeated if the response to the initial welcome message is not heard
var repeatWelcomeMessage = "Say yes for a punch combination, or say no to quit.";

// this is the message that is repeated if Alexa does not hear/understand the reponse to the welcome message
var promptToStartMessage = "Say yes, and I will give you a punch combination. Say no to quit.";

// This is the prompt during the game when Alexa doesnt hear or understand a yes / no reply
var promptToSayYesNo = "Please say yes for a punch combination, or say no to quit.";

// this is the help message during the setup at the beginning of the game
var helpMessage = "I will call out punch combinations. After I say a combination, say yes to continue or say no to quit. Are you ready?";

// message to handle unrecognized or timed out utterances
var repromptPunch = "Sorry, I didn't get that. Let's try again. ";

// general message for reprompting the user
var reprompt = "Sorry, I didn't get that. ";

// This is the goodbye message when the user has asked to quit the game
var goodbyeMessage = "Ok, see you next time!";

var speechNotFoundMessage = "Could not find speech for node";

var nodeNotFoundMessage = "In nodes array could not find node";

var descriptionNotFoundMessage = "Could not find description for node";

var loopsDetectedMessage = "A repeated path was detected on the node tree, please fix before continuing";

// ----------------------- Not needed ----------------------

var utteranceTellMeMore = "tell me more";

var utterancePlayAgain = "play again";
//
// This is the response to the user after the final question when Alex decides on what group choice the user should be given
var decisionMessage = "I think you would make a good";

// This is the prompt to ask the user if they would like to hear a short description of thier chosen profession or to play again
var playAgainMessage = "Say 'tell me more' to hear a short description for this profession, or do you want to play again?";


// --------------- Handlers -----------------------

// Called when the session starts.
exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandler, startGameHandlers, askQuestionHandlers);
    alexa.execute();
};

// set state to start up and  welcome the user
var newSessionHandler = {
  'LaunchRequest': function () { 
    this.handler.state = states.STARTMODE;
    this.emit(':ask', welcomeMessage, reprompt + repeatWelcomeMessage);
  },'AMAZON.HelpIntent': function () { // if a user does not know how to work it
    this.handler.state = states.STARTMODE;
    this.emit(':ask', helpMessage, reprompt + helpMessage);
  },
  'Unhandled': function () { // if a user does not say the right thing
    this.handler.state = states.STARTMODE;
    this.emit(':ask', promptToStartMessage, reprompt + promptToStartMessage);
  }
};

// --------------- Functions that control the skill's behavior -----------------------

// Called at the start of the game, picks and asks first question for the user
var startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    'AMAZON.YesIntent': function () {
        // set state to asking questions
        this.handler.state = states.ASKMODE;

        // ask first question, the response will be handled in the askQuestionHandler
        var message = helper.getSpeech();

        // ask the first question
        this.emit(':ask', message, repromptPunch + message);
    },
    'AMAZON.NoIntent': function () {
        // Handle No intent.
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
         this.emit(':ask', promptToStartMessage, reprompt + promptToStartMessage);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', helpMessage, reprompt + helpMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', promptToStartMessage, reprompt + promptToStartMessage);
    }
});


// user will have been asked a question when this intent is called. We want to look at their yes/no
// response and then ask another question. If we have asked more than the requested number of questions Alexa will
// make a choice, inform the user and then ask if they want to play again
var askQuestionHandlers = Alexa.CreateStateHandler(states.ASKMODE, {

    'AMAZON.YesIntent': function () {
        this.handler.state = states.ASKMODE;
        var message = helper.getSpeech();
        this.emit(':ask', message, repromptPunch + message);
    },
    'AMAZON.NoIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', promptToSayYesNo, reprompt + promptToSayYesNo);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, reprompt + repeatWelcomeMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', promptToSayYesNo, reprompt + promptToSayYesNo);
    }
});

/*
// user has heard the final choice and has been asked if they want to hear the description or to play again
var descriptionHandlers = Alexa.CreateStateHandler(states.DESCRIPTIONMODE, {

 'AMAZON.YesIntent': function () {
        // Handle Yes intent.
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'AMAZON.NoIntent': function () {
        // Handle No intent.
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', promptToSayYesNo, promptToSayYesNo);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'DescriptionIntent': function () {
        //var reply = this.event.request.intent.slots.Description.value;
        //console.log('HEARD: ' + reply);
        helper.giveDescription(this);
      },

    'Unhandled': function () {
        this.emit(':ask', promptToSayYesNo, promptToSayYesNo);
    }
});
*/

// --------------- Helper Functions  -----------------------

var helper = {
    // returns the speech for the provided node id
    getSpeech: function () {
        var nodeIndex = Math.floor(Math.random() * nodes.length);
        return nodes[nodeIndex];
    }
};
