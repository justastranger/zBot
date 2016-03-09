function listener(message){
	console.log(message);
	if(message.command = "err_chanoprivsneeded"){
		global.bot.say(message.args[1], "I'm sorry Dave, I'm afraid I can't do that")
	}
}

exports.type = "error";
exports.listener = listener;