var readline = require("readline");

// We're creating a readline interface so that we can manually input commands and code
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
// Evaluate the input (and log any errors)
rl.on("line", function(cmd){
	try{console.log(eval(cmd));}
	catch(e){console.log(e);}
});
// Globalize the object so that it can be closed as part of the disconnect command
global.rl = rl;

function say(what){
	global.bot.say("#dirtylaundry", what);
}

function action(what){
	global.bot.action("#dirtylaundry", what)
}

function close(args){
	rl.close();
	global.bot.disconnect(args != undefined ? args : "Goodbye...");
	process.exit();
}