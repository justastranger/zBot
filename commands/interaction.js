function say(from, channel, args){
	if(args == "") {
		global.bot.say(channel, "Say what?");
		return;
	}
	global.bot.say(channel, from + ": " + args);
}
function action(from, channel, args){
	if(args == "") {
		global.bot.say(channel, "Do what?");
		return;
	}
	global.bot.action(channel, args);
}
function tell(from, channel, args){
	if(args == "") {
		global.bot.say(channel, "Do what?");
		return;
	}
	var argArray = args.split(" ");
	var target = argArray[0].toLowerCase();
	argArray.shift();
	var message = argArray.join(" ");
	var t = {"sender": from, "message": message};
	if(global.tells[target] == undefined) global.tells[target] = [t];
	else global.tells[target].push(t);
	global.bot.say(channel, "Okay, I'll tell that to "+target)
}

global.declareCommand(say, ["say"], "anyone");
global.declareCommand(action, ["do", "action"], "anyone");
global.declareCommand(tell, ["tell"], "anyone");