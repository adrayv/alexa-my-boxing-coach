var Alexa = require('alexa-sdk');

var states = {
    STARTMODE: '_STARTMODE',                // Prompt the user to start or restart the game.
	WORKOUTMODE: '_WORKOUTMODE'
};

// Punch Combinations
var onePunches = [
	"jab",
	"cross",
	"left hook",
	"right hook",
	"left uppercut",
	"right uppercut",
	"overhand"
];

var twoPunches = [
	"double jab",
	"double cross",
	"jab cross",
	"cross jab",
	"left hook right hook",
	"right hook left hook",
	"cross hook",
	"hook cross",
	"cross uppercut",
	"jab uppercut",
	"jab left hook",
	"jab right hook",
	"jab overhand"
];

var threePunches = [
	"triple jab",
	"jab jab cross",
	"jab cross jab",
	"jab cross hook",
	"jab uppercut hook",
	"jab cross uppercut",
	"cross hook cross",
	"hook cross hook",
	"hook cross uppercut",
	"jab hook cross",
	"uppercut hook cross",
	"cross cross hook"
];

var fourPunches = [
	"jab right hook left hook cross",
	"jab right hook left hook uppercut",
	"jab hook uppercut cross",
	"jab uppercut jab cross",
	"jab uppercut jab hook",
	"jab uppercut hook cross",
	"jab uppercut left hook right hook",
	"jab uppercut hook uppercut",
	"jab cross hook cross",
	"jab cross left hook right hook",
	"jab cross hook uppercut",
	"jab cross uppercut cross",
	"jab cross left uppercut right uppercut",
	"jab hook jab cross",
	"jab hook jab uppercut",
	"jab cross jab cross",
	"jab cross jab uppercut",
	"jab cross hook overhand",
	"jab overhand hook cross",
	"jab overhand hook overhand"
];


// ---------------- Messages ----------------------

var welcomeMessage = "Hi, I'm your Boxing Coach. For a great experince, It's best if you already have some knowledge of boxing, and that you have some open space near you before you start training. Would you like to continue?";

var shortWelcome = "Would you like to continue?";

var sessionDescription = "In this session, we will be doing a couple minutes of warm-ups, a minute of shadow boxing, and then we'll work on our punches. For your safety, please train in an open space. Are you ready to begin?";

var helpMessage = "We will train through a series of boxing exercies. For your safety, please train in an open-space environment. ";

var reprompt = "Sorry, I didn't get that. ";

var goodbyeMessage = "Ok, See you next time!";

var beginWorkout = "Ok, Here we go, ";


// ---------------- Sounds ----------------------

var countDown = "<audio src='https://s3.amazonaws.com/adrayv-bucket/alexa-boxing/boxing-bell.mp3'/> ";


// --------------- Handlers -----------------------

// Called when the session starts.
exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandler, startGameHandlers, workoutHandler);
    alexa.execute();
};

// set state to start up and  welcome the user
var newSessionHandler = {
  'LaunchRequest': function () { 
    this.handler.state = states.STARTMODE;
    this.emit(':ask', welcomeMessage, reprompt + shortWelcome);
  },
  'AMAZON.HelpIntent': function () { // if a user does not know how to work it
    this.handler.state = states.STARTMODE;
    this.emit(':ask', helpMessage + shortWelcome, reprompt + helpMessage + shortWelcome);
  },
  'Unhandled': function () { // if a user does not say the right thing
    this.emit(':ask', reprompt + shortWelcome, reprompt + shortWelcome); // CHECK FOR TYPO
  }
};

// --------------- Functions that control the skill's behavior -----------------------

// state before the workouts begin
var startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    'AMAZON.YesIntent': function () {
    	this.handler.state = states.WORKOUTMODE;
    	this.emit(':ask', sessionDescription); // ask the session descirption, answered in WORKOUT mode
    },
    'AMAZON.NoIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, reprompt + shortWelcome);
    },
    'AMAZON.HelpIntent': function () {
        this.handler.state = states.STARTMODE;
		this.emit(':ask', helpMessage + shortWelcome, reprompt + helpMessage + shortWelcome);
    },
    'Unhandled': function () {
		this.handler.state = states.STARTMODE;
		this.emit(':ask', reprompt + shortWelcome);
    }
});

var workoutHandler = Alexa.CreateStateHandler(states.WORKOUTMODE, {
	'AMAZON.YesIntent': function () {
		this.emit(':tell', beginWorkout + countDown);
	},
    'AMAZON.NoIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, reprompt + shortWelcome);
    },
    'AMAZON.HelpIntent': function () {
        this.handler.state = states.STARTMODE;
		this.emit(':ask', helpMessage + shortWelcome, reprompt + helpMessage + shortWelcome);
    },
    'Unhandled': function () {
		this.handler.state = states.STARTMODE;
		this.emit(':ask', reprompt + shortWelcome);
    }
});


/*
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

// --------------- Helper Functions  -----------------------

var helper = {
    // returns the speech for the provided node id
    getSpeech: function () {
        var nodeIndex = Math.floor(Math.random() * nodes.length);
        return nodes[nodeIndex];
    }
};
*/
