var Alexa = require('alexa-sdk');

var states = {
    STARTMODE: '_STARTMODE',                // Prompt the user to start or restart the game.
	WARMUP: '_WARMUP',
	STANCEMODE: '_STANCEMODE',
	DEFENSEMODE: '_DEFENSEMODE'
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

var shortWelcome = "Would you like to continue to the next section?";

var sessionDescription = "In this session, we will do some warm-ups, practice our footwork, work on our defense, and refine our punches. For your safety, please train in an open space. Are you ready to begin?";

var stanceTransition = "For our next exercise, we will work on our boxing footwork and movement. Would you like to continue? ";

var stanceDescription = "Before we begin, please take a moment and assume a comfortable fighting stance. During this exercise, I will call out different movements and give you a few seconds to perform them. This exercise will last for two minutes. ";

var defenseTransition = "For our next exercise, we will work on our defense. Would you like to continue? ";

var helpMessage = "We will train through a series of boxing exercies. For your safety, please train in an open-space environment. ";

var reprompt = "Sorry, I didn't get that. ";

var goodbyeMessage = "Ok, See you next time!";

var beginExercise = "Ok, Get ready. At the sound of the bell, we will begin. ";

var catchBreath = "Take a moment to catch your breath. ";

// ---------------- Variables ----------------------

var warmupTime = "30 ";
var numMovements = 5;

// ---------------- Sounds ----------------------

var bell = "<audio src='https://s3.amazonaws.com/adrayv-bucket/alexa-boxing/boxing-bell.mp3'/> ";
var breakQuick = "<break time='700ms'/> ";
var break1 = "<break time='1s'/> ";
var break3 = "<break time='3s'/> ";
var break5 = "<break time='5s'/> ";
var break30 = "<break time='10s'/> <break time='10s'/> <break time='10s'/> ";
var praise = "<emphasis level='strong'>Well Done!</emphasis>. "

// ---------------- Transition Messages ----------------------

var transitions = {
	first: "First, ",
	next: praise + catchBreath + break3 + "Next, ",
	lastly: praise + catchBreath + break3 + "Lastly, "
};

// ---------------- Modules ----------------------

var warmups = [
	"Let's do Jumping Jacks for " + warmupTime + "seconds. " + bell,
	"Let's do High Knees for " + warmupTime + "seconds. " + bell,
	"Let's do Torso Twists for " + warmupTime + "seconds. " + bell,
	"Let's do Squats for " + warmupTime + "seconds. " + bell
];

var movements = [
	"Move Forward. " + breakQuick,
	"Move Back. " + breakQuick,
	"Move Right. " + breakQuick,
	"Move Left. " + breakQuick
];

// --------------- Handlers -----------------------

// Called when the session starts.
exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandler, startGameHandlers, warmupHandler, stanceHandler, defenseHandler);
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
	'Unhandled': function () { // if a user an unrecognized statement
		this.emit(':ask', reprompt + shortWelcome, reprompt + shortWelcome); // CHECK FOR TYPO
	}
};

// --------------- Functions that control the skill's behavior -----------------------
// FIX: please fix all help and unhandled handlers. as of right now, they restore user back to start mode

// state before the workouts begin
var startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, { // responses for after the welcome message
    'AMAZON.YesIntent': function () {
    	this.handler.state = states.WARMUP;
    	this.emit(':ask', sessionDescription); // ask the session descirption, answered in WARMUP mode
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

var warmupHandler = Alexa.CreateStateHandler(states.WARMUP, { // responses for after the session description
	'AMAZON.YesIntent': function () {
		var warmupRoutine = buildWarmup(warmups);
		this.handler.state = states.STANCEMODE;
		this.emit(':ask', beginExercise + warmupRoutine + praise + stanceTransition);
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

var stanceHandler = Alexa.CreateStateHandler(states.STANCEMODE, { // handlers for after the WARMUP
	'AMAZON.YesIntent': function () {
		var intro = stanceDescription + beginExercise + bell;
		var movementRoutine = getMovements(movements);
		var ending = praise + catchBreath + break3 + defenseTransition;
		this.handler.state = states.DEFENSEMODE;
		this.emit(':ask', intro + movementRoutine + ending);
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

var defenseHandler = Alexa.CreateStateHandler(states.DEFENSEMODE, { // handlers for after STANCE
	'AMAZON.YesIntent': function () {
		this.emit(':tell', "PLEASE FIX ME");
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

// --------------- Helper Functions  -----------------------

function getSpeech() {
    var nodeIndex = Math.floor(Math.random() * nodes.length);
    return nodes[nodeIndex];
}

function getMovements(movements) {
	var str = "";
	for(i = 0; i < numMovements; ++i) {
		str += movements[Math.floor(Math.random() * movements.length)];
	}
	return str;
}

function buildDefenses(

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
    str += break5;
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
