function join(from, channel, args){
	if(args == "") {
		global.bot.say(channel, "Join what?");
		return;
	}
	global.bot.join(args);
}

// Parts from the current channel
// 
function part(from, channel, args){
	global.bot.part(channel, args != "" ? args : "Goodbye...");
}
function disconnect(from, channel, args){
	global.rl.close();
	global.bot.disconnect(args != "" ? args : "Goodbye...");
	process.exit();
}

global.declareCommand(join, ["join"], "op");
global.declareCommand(part, ["part", "leave"], "op");
global.declareCommand(disconnect, ["kill", "disconnect", "quit", "dc"], "owner");