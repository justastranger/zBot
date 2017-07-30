function say(from, username, channel, args){
	if(args == "") {
		global.bot.say(channel, "Say what?");
		return;
	}
	global.bot.say(channel, from + ": " + args);
}

function asay(from, username, channel, args){
	global.bot.say(channel, args);
}

function action(from, username, channel, args){
	if(args == "") {
		global.bot.say(channel, "Do what?");
		return;
	}
	global.bot.action(channel, args);
}

function tell(from, username, channel, args){
	if(args == "") {
		global.bot.say(channel, "Tell what to who?");
		return;
	}
	var argArray = args.split(" ");
	var target = argArray[0].toLowerCase();
	argArray.shift();
	var message = argArray.join(" ");
	var t = {"sender": from, "message": message};
	if(global.tells[target] == undefined) global.tells[target] = [t];
	else global.tells[target].push(t);
	global.bot.say(channel, "Okay, I'll tell "+target+" that.")
}

function help(from, username, channel, args){
	global.bot.say(channel, "The supported commands are: "+ Object.keys(global.commands).join(", "));
}

function lewd(from, username, channel, args){
	global.bot.say(channel, "http://i.imgur.com/mgveyIr.png");
}

function seen(from, username, channel, args){
	if(global.seen[args] == undefined) {
		global.bot.say(channel, "Who's that?");
		return;
	}
	var tmp = args + " was last seen at " + global.seen[args];
	global.bot.say(channel, tmp);
}

function nick(from, username, channel, args){
	global.bot.changeNick(args);
}

function ping(from, username, channel, args){
	global.bot.say(channel, args + ": PING PING PING");
}

global.declareCommand(asay, ["asay"], "owner");
//global.declareCommand(lewd, ["lewd"], "anyone");
global.declareCommand(help, ["help", "commands"], "anyone");
global.declareCommand(say, ["say"], "anyone");
global.declareCommand(action, ["do", "action"], "anyone");
global.declareCommand(tell, ["tell"], "anyone");
global.declareCommand(nick, ["nick", "name"], "owner");
global.declareCommand(seen, ["seen"], "anyone");
global.declareCommand(ping, ["ping"], "anyone");