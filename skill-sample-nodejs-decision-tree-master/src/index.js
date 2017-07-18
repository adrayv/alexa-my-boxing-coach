var Alexa = require('alexa-sdk');

var states = {
    STARTMODE: '_STARTMODE',                // Prompt the user to start or restart the game.
	PREWARMUP: '_PREWARMUP'
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

var sessionDescription = "In this session, we will do some warm-ups, practice our footwork, work on our defense, and refine our punches. For your safety, please train in an open space. Are you ready to begin?";

var helpMessage = "We will train through a series of boxing exercies. For your safety, please train in an open-space environment. ";

var reprompt = "Sorry, I didn't get that. ";

var goodbyeMessage = "Ok, See you next time!";

var beginWorkout = "Ok, Get ready. At the sound of the bell, we will begin. ";

// ---------------- Variables ----------------------

var warmupTime = "30 ";

// ---------------- Sounds ----------------------

var bell = "<audio src='https://s3.amazonaws.com/adrayv-bucket/alexa-boxing/boxing-bell.mp3'/> ";
var break3 = "<break time='3s'/> ";
var break5 = "<break time='5s'/> ";

// ---------------- Transition Messages ----------------------

var transitions = {
	first: "First, ",
	next: "<emphasis level='strong'>Great Job!</emphasis>. " + break3 + "Next, ",
	lastly: "Lastly, "
};

// ---------------- Modules ----------------------

var warmups = [
	"Let's do Jumping Jacks for " + warmupTime + "seconds. " + bell,
	"Let's do High Knees for " + warmupTime + "seconds. " + bell,
	"Let's do Torso Twists for " + warmupTime + "seconds. " + bell,
	"Let's do Squats for " + warmupTime + "seconds. " + bell
];

// --------------- Handlers -----------------------

// Called when the session starts.
exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandler, startGameHandlers, preWarmupHandler);
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
    	this.handler.state = states.PREWARMUP;
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

var preWarmupHandler = Alexa.CreateStateHandler(states.PREWARMUP, {
	'AMAZON.YesIntent': function () {
		var warmupRoutine = buildWarmup(warmups);
		this.emit(':tell', beginWorkout + warmupRoutine);
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
        var message = getSpeech();
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
*/

// --------------- Helper Functions  -----------------------

function getSpeech() {
    var nodeIndex = Math.floor(Math.random() * nodes.length);
    return nodes[nodeIndex];
}

function buildWarmup(unshuffled) {
    warmups = shuffle(unshuffled);
    var str = transitions['first'] + warmups[0] + break5; // set up the first warmup
    for(i = 1; i < warmups.length - 1; ++i) { // iterate through all but the last warmup
		str += transitions['next'];
		str += warmups[i];
		str += break5; // FIX: chage this to a longer time
    }
    str += transitions['lastly'];
    str += warmups[warmups.length - 1];
    return str;
}

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
