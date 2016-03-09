function listener(from, channel, message){
	// Look for the word "lewd" in messages, link to a reaction image if it's found
	if(~message.indexOf("lewd")) global.bot.say(channel, "http://i.imgur.com/mgveyIr.png");
}

exports.type = "message#";
exports.listener = listener;