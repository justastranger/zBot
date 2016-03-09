function listener(channel, from, message){
	bot.join(channel);
	bot.say(channel, "Hello!")
}

exports.type = "invite";
exports.listener = listener;