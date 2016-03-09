function listener(from, channel, message){
	console.log(channel + "=>" + from + ": " + message);
}

exports.type = "message#";
exports.listener = listener;