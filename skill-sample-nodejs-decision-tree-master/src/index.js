var Alexa = require('alexa-sdk');

var states = {
    STARTMODE: '_STARTMODE',                // Prompt the user to start or restart the game.
    STAGEMODE: '_STAGEMODE'
};


// ---------------- Messages ----------------------

var welcomeMsg = "Hi, I'm your Boxing Coach. ";

var usageMsg = "We are going to practice our boxing skills through several rounds of punching combination drills. ";

var disclosureMsg = "These workouts are meant for users who already have some boxing experience to supplement the work they do at a real gym. For the best experience, use boxing gloves and a heavybag, or work mitts with a partner. ";

var promptNumRounds = "How many rounds of boxing would you like to do? ";

var workoutDesc1 = "Ok. We will do ";

var workoutDesc3 = "Each round will last for three minutes. You can use my commands to shadowbox, work on a heavybag, or work mitts with a partner. ";

var continueMsg = "Would you like to continue? ";

var readyMsg = "Are you ready to begin? ";

//var helpMsg = "We will train through a series of boxing exercies. For your safety, please train in an open-space environment. ";

// ---------------- Help Messages ----------------------

var getHelp = "If you need help using this skill, whenever I ask you a question just say, I need help. ";

var numRoundsHelp = "A typical round of boxing is three minutes. ";

var numRoundsUsage = "Please say a number between one and twelve, and we will do that many number of rounds. ";

var goodbyeMsg = "Ok, see you next time!";

// ---------------- Variables ----------------------

var numRounds = 0;
var allowedRoundsLower = 1;
var allowedRoundsUpper = 12;

// ---------------- Sounds ----------------------

var bell = "<audio src='https://s3.amazonaws.com/adrayv-bucket/alexa-boxing/boxing-bell.mp3'/> ";
var breakQuick = "<break time='700ms'/> ";
var break1 = "<break time='1s'/> ";
var break3 = "<break time='3s'/> ";
var break5 = "<break time='5s'/> ";
var break30 = "<break time='10s'/> <break time='10s'/> <break time='10s'/> ";

// ---------------- Transition Messages ----------------------

var excitement = "Great! ";

var praise = "<emphasis level='strong'>Well Done!</emphasis>. ";

var reprompt = "Sorry, I didn't get that. ";

var beginExercise = "Ok, Get ready. At the sound of the bell, we will begin. ";

var catchBreath = "Take a moment to catch your breath. ";

// ---------------- Modules ----------------------

// --------------- Handlers -----------------------

// FIX: please fix all help and unhandled handlers. as of right now, they restore user back to start mode

// Called when the session starts.
exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandler, startModeHandler, stagingHandler);
    alexa.execute();
};

// set state to start up and welcome the user
var newSessionHandler = {
	'LaunchRequest': function () { 
		var question = welcomeMsg + usageMsg + disclosureMsg + continueMsg;
		var repeat = reprompt + getHelp + usageMsg + continueMsg;
		this.handler.state = states.STARTMODE;
		this.emit(':ask', question, repeat);
	},
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMsg);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMsg);
    },
	'AMAZON.HelpIntent': function () { // if a user does not know how to work it
		var question = usageMsg + continueMsg
		var repeat = reprompt + question;
		this.emit(':ask', question, repeat);
	}
	/*
    'AMAZON.StartOverIntent': function () {
		var greeting = welcomeMsg + usageMsg + disclosureMsg + continueMsg;
		var repeat = reprompt + usageMsg + continueMsg;
		this.emit(':ask', greeting, repeat);
    }
	'Unhandled': function () { // if a user puts an unrecognized statement
		this.emit(':ask', reprompt + usageMsg + continueMsg); 
	}
	*/
};

var startModeHandler = Alexa.CreateStateHandler(states.STARTMODE, { // responses for after the welcome message
	'AMAZON.YesIntent': function() {
		var question = excitement + promptNumRounds;
		var repeat = reprompt + getHelp + promptNumRounds;
		this.handler.state = states.STAGEMODE;
		this.emit(':ask', question, repeat);
	},
	'AMAZON.NoIntent': function() {
		this.emit(':tell', goodbyeMsg);
	},
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMsg);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMsg);
    },
    'AMAZON.StartOverIntent': function () {
		var question = welcomeMsg + usageMsg + disclosureMsg + continueMsg;
		var repeat = reprompt + getHelp + usageMsg + continueMsg;
		this.emit(':ask', question, repeat);
    },
	'AMAZON.HelpIntent': function () { // if a user does not know how to work it from the welcomeMessage
		var question = usageMsg + continueMsg
		var repeat = reprompt + question;
		this.emit(':ask', question, repeat);
	},
	'Unhandled': function () { // handles unrecognized phrases from welomeMessage 
		var question = reprompt + getHelp + continueMsg;
		this.emit(':ask', question); 
	}
});

var stagingHandler = Alexa.CreateStateHandler(states.STAGEMODE, { // responses for after the welcome message
	'numRoundsIntent': function() {
		var question = undefined;
		var repeat = undefined;
		var slotVal = undefined;
		slotVal = this.event.request.intent.slots.NUMROUNDS.value;
		if(slotVal) {
			numRounds = slotVal;
			if(numRounds < allowedRoundsLower || numRounds > allowedRoundsUpper) {
				question = numRoundsUsage + promptNumRounds;
				repeat = reprompt + question;
				this.emit(':ask', question, repeat);
			}
			var question = getWorkoutDesc(numRounds);
			var repeat = reprompt + readyMsg;
			this.emit(':tell', question, repeat);
			//this.handler.state = states.
		}
		else { // called if a user does not give a numRoundsIntent.
			var question = reprompt + getHelp + numRoundsUsage + promptNumRounds;
			this.emit(':ask', question);
		}
	},
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMsg);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMsg);
    },
    'AMAZON.StartOverIntent': function () {
		var question = welcomeMsg + usageMsg + disclosureMsg + continueMsg;
		var repeat = reprompt + getHelp + usageMsg + continueMsg;
		this.handler.state = states.STARTMODE;
		this.emit(':ask', question, repeat);
    },
	'AMAZON.HelpIntent': function () {
		var question = usageMsg + numRoundsHelp + numRoundsUsage + promptNumRounds;
		var repeat =  reprompt + promptNumRounds;
		this.emit(':ask', question, repeat);
	},
	'Unhandled': function () { // This is not called when getting an Unhandled utterance in this state
		var question = reprompt + getHelp + numRoundsUsage + promptNumRounds;
		this.emit(':ask', question);
	}
});

// --------------- Helper Functions  -----------------------

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
		j = Math.floor(Math.random() * i);
    	x = a[i - 1];
    	a[i - 1] = a[j];
    	a[j] = x;
	}
	return a;
}

function getWorkoutDesc(num) {
	var workoutDesc2 = undefined;
	if(num == 1) {
		workoutDesc2 = " round. ";
	}
	else {
		workoutDesc2 = " rounds. ";
	}
	return workoutDesc1 + num.toString() + workoutDesc2 + workoutDesc3 + readyMsg;
}
