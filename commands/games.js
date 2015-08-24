function roll(from, channel, args){
	if (args == "" || args.split(" ").length != 1){
		global.bot.say(channel, "That isn't a dice roll...")
		return;
	}
	var result = (function(args){
		var amount = args.split("d")[0];
		var kind = args.split("d")[1];
		var total = 0;
		var rolls = [];
		var roll;
		for (var i = 0; i < amount; i++){
			roll = Math.ceil(Math.random() * kind);
			total += roll;
			rolls.push(roll);
		}
		return [total, rolls];
	})(args);
	global.bot.say(channel, "Rolled "+args+", got: "+result[0] + " with "+ result[1].join(" "));
}
function skye(from, channel, args){
	var users = global.bot.chanData(channel).users;
	var userArray = [];
	for (var a in users){
		userArray.push(a.toLowerCase());
	}
	if(~userArray.indexOf("skye")) global.bot.say(channel, "Hi Skye!");
	else global.bot.say(channel, "Where's Skye?");
}
// Declare all aliases of the command
global.declareCommand(roll, ["roll", "die", "d"], "anyone");
global.declareCommand(skye, ["skye"], "anyone");

var BlackJack = require("./blackjack.js");
var blackjackObject = new BlackJack();

function bj(from, channel, args){
	console.log(blackjackObject);
	var subcommand = args.split(" ")[0];
	if(blackjackObject.commands[subcommand] != undefined) blackjackObject.commands[subcommand](from, channel, args);
	else blackjackObject.commands.help(from, channel, args);
	// console.log(subcommand);
}
global.declareCommand(bj, ["blackjack"], "anyone");